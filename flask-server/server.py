from flask import Flask, redirect, request, jsonify, session
from dotenv import load_dotenv
import requests
import os
import urllib.parse
from datetime import datetime
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.secret_key = os.getenv('SECRET_KEY')
clientId = os.getenv('SPOTIFY_CLIENT_ID')
clientSecret = os.getenv('SPOTIFY_CLIENT_SECRET')

redirectUri = 'https://127.0.0.1:5000/callback'
authUrl = 'https://accounts.spotify.com/authorize'
tokenUrl = 'https://accounts.spotify.com/api/token'
apiBaseUrl = 'https://api.spotify.com/v1/'

# constructs the url for user to log in to spotify
@app.route('/login')
def login():
    scope = 'user-top-read playlist-read-private playlist-read-collaborative'

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
        session['access_token'] = token_info['access_token']
        session['refresh_token'] = token_info['refresh_token']
        session['expires_at'] = datetime.now().timestamp() + token_info['expires_in']
        return redirect(f'https://127.0.0.1:5173/')    
    else:
        return jsonify({'Error': "Authorisation code not provided."}), 400

# refresh token path if access token has expired
@app.route('/refresh-token')
def refresh_token():
     if 'refresh_token' not in session:
        return redirect('/login')
     
     refresh_redirect_uri = request.args.get('redirect_uri')
     
     if datetime.now().timestamp() > session['expires_at']:
        req_body = {
             'grant_type': 'refresh_token',
             'refresh_token': session['refresh_token'],
             'client_id': clientId,
             'client_secret': clientSecret
        }

        # send a post request to get a new access token and update the session object with the new access token and expiry time
        response = requests.post(tokenUrl, data=req_body)
        new_token_info = response.json()

        session['access_token'] = new_token_info['access_token']
        session['expires_at'] = datetime.now().timestamp() + new_token_info['expires_in']
    
        return redirect(f'{refresh_redirect_uri}')
     
# route gets the data of the top 5 artists from the users listening with the time range specified in the request
@app.route('/artist-animated')
def artist_animated():
    if 'access_token' not in session:
             return redirect('/login')
        
    if datetime.now().timestamp() > session['expires_at']:
             return redirect('/refresh-token?redirect_uri=' + request.path)
        
    headers = {
             'Authorization': f'Bearer {session['access_token']}'
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

@app.route('/genre-animated')
def genre_animated():        
        if 'access_token' not in session:
             return redirect('/login')
        
        if datetime.now().timestamp() > session['expires_at']:
             return redirect('/refresh-token?redirect_uri=' + request.path)
        
        headers = {
             'Authorization': f'Bearer {session['access_token']}'
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
            print(sorted_genres)

            top_5_genres = [{'genre' : genre, 'count': count} for genre, count in sorted_genres[:5]]
            print(top_5_genres)

            return top_5_genres

        except requests.exceptions.HTTPError as e:
                return jsonify({"error": f"Failed to fetch data from Spotify: {e}"}), response.status_code
        except Exception as e:
            return jsonify({"error": f"An unexpected error occurred: {e}"}), 500  

# gets popularity values for the first 50 songs in a playlist
@app.route('/playlist-track-popularity')
def track_popularity():        
    if 'access_token' not in session:
        return redirect('/login')
        
    if datetime.now().timestamp() > session['expires_at']:
        return redirect('/refresh-token?redirect_uri=' + request.path)
    
    headers = {
        'Authorization': f'Bearer {session['access_token']}'
    }  
    
    playlist_id = request.args.get('playlist_id')

    params = {
        'fields': 'items(track(popularity))',
        'limit': 50
    }

    try:
        response = requests.get(apiBaseUrl + f'playlists/{playlist_id}/tracks', headers=headers, params=params)
        response.raise_for_status()
        
        data = response.json()

        # create an array with only popularity values
        simplified_data = []
        if 'items' in data:
            for item in data['items']:
                if 'track' in item and item['track'] and 'popularity' in item['track']:
                    popularity = item['track']['popularity']
                    simplified_data.append(popularity)
            return jsonify(simplified_data)
        else:
            return jsonify({"error": "Invalid data format from Spotify"}), 500
 
    except requests.exceptions.HTTPError as e:
        return jsonify({"error": f"Failed to fetch data from Spotify: {e}"}), response.status_code
    
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500     

# gets the first 6 playlist names followed by or created by the user
@app.route('/user-playlists')
def user_playlists():
    if 'access_token' not in session:
        return redirect('/login')
        
    if datetime.now().timestamp() > session['expires_at']:
        return redirect('/refresh-token?redirect_uri=' + request.path)
    
    headers = {
        'Authorization': f'Bearer {session['access_token']}'
    }  

    params = {
        'limit': 6
    }

    try:
        response = requests.get(apiBaseUrl + 'me/playlists', headers=headers, params=params)
        response.raise_for_status()

        data = response.json()
        playlist_names = []

        # store the names of the playlists in playlist_names from response
        if 'items' in data:
            for item in data['items']:
                playlist_names.append(item['name'])
            
            return jsonify(playlist_names)
        
        else:
            return jsonify({"error": "Invalid data format from Spotify"}), 500
        
    except requests.exceptions.HTTPError as e:
        return jsonify({"error": f"Failed to fetch data from Spotify: {e}"}), response.status_code
    
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500  
    
# returns the url of the playlist cover image
@app.route('/get-playlist-cover')
def get_playlist_cover():
    if 'access_token' not in session:
        return redirect('/login')
        
    if datetime.now().timestamp() > session['expires_at']:
        return redirect('/refresh-token?redirect_uri=' + request.path)
    
    headers = {
        'Authorization': f'Bearer {session['access_token']}'
    }  

    playlist_id = request.args.get('playlist_id')

    try:
        response = requests.get(apiBaseUrl + f'playlists/{playlist_id}/images', headers=headers)
        response.raise_for_status()

        data = response.json()

        if isinstance(data, list) and len(data) > 0 and 'url' in data[0]:
            return jsonify(data[0]['url'])
        else:
            return jsonify({"error": "Invalid data format from Spotify"}), 500
            
    except requests.exceptions.HTTPError as e:
        return jsonify({"error": f"Failed to fetch data from Spotify: {e}"}), response.status_code
    
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500  

# lets react know if the user is authenticated or not
@app.route('/is-authenticated')
def is_authenticated():
    if 'access_token' in session and datetime.now().timestamp() < session['expires_at']:
        return jsonify({'authenticated': True})
    else:
        return jsonify({'authenticated': False}), 401
          
if __name__ == '__main__':
    app.run(
        debug=True, 
        ssl_context=('certs/localhost+1.pem', 'certs/localhost+1-key.pem')
        )