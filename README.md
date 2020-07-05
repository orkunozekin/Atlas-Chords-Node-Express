The framework used for creating this node server is Express.

This express web server handles GET and POST HTTP requests.

The endpoints for GET request are "/chords" and "/chords/chord_id". 

The endpoint for POST request is "/chords".

There is one database that has four tables in it, which are respectively "users", "chords", "musical_noteS", and "favorites".
There is a one-to-many relationship between "users" and "chords" tables. 
There is a one-to-many relationship between "chords" and "musical_notes" tables. 

The tables are seeded using migration scripts.

The URL for the live link for the server is https://still-brushlands-47885.herokuapp.com and all of the routers are set to "/api". 
Therefore, if ah HTTP request is to be made to this server, the url to be used would be https://still-brushlands-47885.herokuapp.com/api . 

The middleware used for authentication is JSON Web Token(JWT). 



