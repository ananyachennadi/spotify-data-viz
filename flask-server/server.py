from flask import Flask, redirect, request, jsonify, session, make_response
from dotenv import load_dotenv
import requests
import os
import urllib.parse
from datetime import datetime, timedelta
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)

app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_DOMAIN'] = 'spotify-dash-rax3.onrender.com'

REACT_APP_URL = os.getenv('REACT_APP_URL')
FLASK_API_URL = os.getenv('FLASK_API_URL')
app.secret_key = os.getenv('SECRET_KEY')
clientId = os.getenv('SPOTIFY_CLIENT_ID')
clientSecret = os.getenv('SPOTIFY_CLIENT_SECRET')

CORS(app, origins=["https://spotify-dash-six.vercel.app"], supports_credentials=True)

redirectUri = f'{FLASK_API_URL}/callback'
authUrl = 'https://accounts.spotify.com/authorize'
tokenUrl = 'https://accounts.spotify.com/api/token'
apiBaseUrl = 'https://api.spotify.com/v1/'

# constructs the url for user to log in to spotify
@app.route('/login')
def login():
    scope = 'user-top-read user-library-read user-read-recently-played'

    params = {
        'client_id': clientId,
        'response_type': 'code',
        'scope': scope,
        'redirect_uri' : redirectUri,
    }

    auth_url = f'{authUrl}?{urllib.parse.urlencode(params)}'
    
    return redirect(auth_url)

# route to provide client secret and obtain an access token
@app.route('/callback')
def callback():
    if 'error' in request.args:
        return jsonify({'Error': request.args['error']})
    elif 'code' in request.args:
        req_body = {
            'code': request.args['code'],
            'grant_type': 'authorization_code',
            'redirect_uri': redirectUri,
            'client_id': clientId,
            'client_secret': clientSecret
        }
        
        # send information needed to obtain an access token to the spotify api and store the response
        response = requests.post(tokenUrl, data=req_body)
        token_info = response.json()

        # store key information from the response
        expires_at = datetime.now() + timedelta(seconds=token_info.get('expires_in', 3600))

        #set the cookies and then redirect
        redirect_response = make_response(redirect(os.environ.get('REACT_APP_URL')))

        # Set the access token as a secure, httponly cookie
        redirect_response.set_cookie(
            'access_token',
            token_info.get('access_token'),
            httponly=True,
            secure=True,
            samesite='None',
            expires=expires_at
        )

        # Set the refresh token as a secure, httponly cookie
        redirect_response.set_cookie(
            'refresh_token',
            token_info.get('refresh_token'),
            httponly=True,
            secure=True,
            samesite='None'
        )
        
        return redirect_response
    else:
        return jsonify({'Error': "Authorisation code not provided."}), 400

# refresh token path if access token has expired
@app.route('/refresh-token')
def refresh_token():
     refresh_token = request.cookies.get('refresh_token')

     if not refresh_token:
        return redirect('/login')
     
     req_body = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': clientId,
        'client_secret': clientSecret
     }

        # send a post request to get a new access token and update the session object with the new access token and expiry time
     response = requests.post(tokenUrl, data=req_body)
     new_token_info = response.json()

     expires_at = datetime.now() + timedelta(seconds=new_token_info.get('expires_in', 3600))
    
     redirect_response = make_response(redirect(os.environ.get('REACT_APP_URL')))
    
     redirect_response.set_cookie(
        'access_token',
        new_token_info.get('access_token'),
        httponly=True,
        secure=True,
        samesite='None',
        expires=expires_at
    )
     
     redirect_response.set_cookie(
        'refresh_token',
        new_token_info.get('refresh_token'),
        httponly=True,
        secure=True,
        samesite='None'
    )
    
     return redirect_response

        
     
# route gets the data of the top 5 artists from the users listening with the time range specified in the request
@app.route('/artist-animated')
def artist_animated():
    if not request.cookies.get('access_token'):
             return redirect('/login')
        
    headers = {
             'Authorization': f'Bearer {request.cookies.get('access_token')}'
    }

    time_range = request.args.get('time_range', 'medium_term')

    params = {
         'time_range': time_range,
         'limit': 5
    }

    # send request to get top 5 artists and from response only store the artist names
    try:
        response = requests.get(apiBaseUrl + 'me/top/artists', headers=headers, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        if 'items' in data:
            artist_names = [artist['name'] for artist in data['items']]
            return jsonify(artist_names)
        else:
            return jsonify({"error": "Invalid data format from Spotify"}), 500
    
    except requests.exceptions.HTTPError as e:
        return jsonify({"error": f"Failed to fetch data from Spotify: {e}"}), response.status_code
    
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500

# get the top 5 genres based on a specified time range
@app.route('/genre-animated')
def genre_animated():        
        if not request.cookies.get('access_token'):
             return redirect('/login')
        
        headers = {
             'Authorization': f'Bearer {request.cookies.get('access_token')}'
        }  

        time_range = request.args.get('time_range', 'medium_term')

        params = {
             'limit': 14,
             'time_range': time_range
        }

        try:
            # send request to get top 14 artists 
            response = requests.get(apiBaseUrl + 'me/top/artists', headers=headers, params=params)
            response.raise_for_status()

            data = response.json()

            # store genres and counts from top 14 artists
            if 'items' in data:
                 genre_counts = {}
                 for artist in data['items']:
                     for genre in artist['genres']:
                        genre_counts[genre] = genre_counts.get(genre, 0) + 1
            else:
                return jsonify({"error": "Invalid data format from Spotify"}), 500
            
            # sort the dictionary in descending order and get the top 5 genres and count
            sorted_genres = sorted(genre_counts.items(), key=lambda item: item[1], reverse=True)

            top_5_genres = [{'genre' : genre, 'count': count} for genre, count in sorted_genres[:5]]

            return top_5_genres

        except requests.exceptions.HTTPError as e:
                return jsonify({"error": f"Failed to fetch data from Spotify: {e}"}), response.status_code
        except Exception as e:
            return jsonify({"error": f"An unexpected error occurred: {e}"}), 500   

@app.route('/saved-tracks-popularity')
def saved_tracks_popularity():
    if not request.cookies.get('access_token'):
        return redirect('/login')
        
    headers = {
        'Authorization': f'Bearer {request.cookies.get('access_token')}'
    }  

    # Fetch user's saved tracks
    retries = 3
    for i in range(retries):
        try:
            saved_tracks_response = requests.get(apiBaseUrl + 'me/tracks?limit=50', headers=headers)
            saved_tracks_response.raise_for_status()

            # Extract popularity scores
            popularity_values = [item['track']['popularity'] for item in saved_tracks_response.json().get('items', [])]
            return jsonify(popularity_values)

        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429 and i < retries - 1:
                print(f"Rate limit exceeded.")
                continue
            else:
                return jsonify({"error": f"Failed to fetch saved tracks: {e}"}), e.response.status_code

        except Exception as e:
            return jsonify({"error": f"An unexpected error occurred: {e}"}), 500  

    return jsonify({"error": "Failed to fetch saved tracks after multiple retries due to rate limiting."}), 429

# get 6 most recently played songs by the user
@app.route('/recently-played')
def recently_played():
    if not request.cookies.get('access_token'):
        return redirect('/login')
        
    headers = {
        'Authorization': f'Bearer {request.cookies.get('access_token')}'
    }

    params = {
         'limit': 6
    }

    try:
            response = requests.get(apiBaseUrl + 'me/player/recently-played', headers=headers, params=params)
            response.raise_for_status()

            # store the id and names of the songs
            tracks = [{'id': item['track']['id'], 'name': item['track']['name']} for item in response.json().get('items', [])]
            return jsonify(tracks)

    except requests.exceptions.HTTPError as e:
            return jsonify({"error": f"Failed to fetch data from Spotify: {e}"}), response.status_code

    except Exception as e:
            return jsonify({"error": f"An unexpected error occurred: {e}"}), 500  
    
# get the song cover using a specified song id
@app.route('/song-cover')
def song_cover():
    if not request.cookies.get('access_token'):
        return redirect('/login')
        
    headers = {
        'Authorization': f'Bearer {request.cookies.get('access_token')}'
    }

    id = request.args.get('id')

    try:
            response = requests.get(apiBaseUrl + f'tracks/{id}', headers=headers)
            response.raise_for_status()

            album_images = response.json().get('album', {}).get('images', [])

            # Get the URL of the song image
            cover_url = album_images[0]['url'] if album_images else None

            if cover_url:
                return jsonify({'url': cover_url})
            else:
                return jsonify({"error": "No album cover found"}), 404

    except requests.exceptions.HTTPError as e:
            return jsonify({"error": f"Failed to fetch data from Spotify: {e}"}), response.status_code

    except Exception as e:
            return jsonify({"error": f"An unexpected error occurred: {e}"}), 500 

@app.route('/logout')
def logout():
    # Create a response object with a redirect to the frontend's home page
    response = make_response(redirect(os.environ.get('REACT_APP_URL')))
    response.set_cookie('access_token', '', httponly=True, secure=True, samesite='None', expires=0)
    
    return response

# lets react know if the user is authenticated or not
@app.route('/is-authenticated')
def is_authenticated():
    access_token = request.cookies.get('access_token')
    if access_token:
        return jsonify({'authenticated': True})
    else:
        return jsonify({'authenticated': False}), 401