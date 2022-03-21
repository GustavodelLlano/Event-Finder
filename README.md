# Project module 2

Event finder web aplication using Ticketmaster API and our own CRUD of events working together, also using Google Maps API.
Proyect developed in back-end, rendering with handlebars.

Deployed at: https://event-finder-revolution-2.herokuapp.com/

Endpoints table 



| Method    |  URL     | Description |  Protected   |
| :-------- | :------- | :---------- | :----------- |
| GET | `/` | Index |   No   |
| GET | `/login ` | Login form render | No |
| POST | `/login ` | Login form handler | No |
| POST | `/logout ` | Logout form handler | No |
| GET | `/singup ` | Singup form render | No |
| POST | `/singup ` | Singup form handler | No |
| GET | `/events` | Search form render for events | No |
| POST | `/events` | Search form handler for events | No |
| GET | `/events/:id/details` | Search form render for events | No |
| GET | `/events/create` | Create form render for events | Yes |
| POST | `/events/create` | Create form handle for events | Yes |
| GET | `/events/:id/edit` | Edit form render for events | Yes |
| POST | `/events/:id/edit` | Edit form handle for events | Yes |
| POST | `/events/:id/delete` | Edit form handle for events | Yes |
| GET | `/events/list` | Event list render | No |
| GET | `/events/details/:id` | Events details render | No |
| GET | `/user/:id` | User details render | Yes |
| GET | `/user/:id/edit` | User edit form render | Yes |
|POST | `/user/:id/edit` | User edit form handler | Yes |
| GET | `/user/:id/friends` | User's friends list | Yes |
