## Admin Backend

#### Technology Stack:
- Django
- Django Rest Framework
- Corsheaders
- Bootstrap and JS for frontend purposes

#### Contains the Restful API's for Beats Allocation, and also to handle the admin page of the app
Django Rest Framework is used for the same.

The API can be viewed on : http://aman28.pythonanywhere.com/

### API endpoints :
GET
- `'/'` , Default page, contains the landing page
- `'/policecount'` , fetches the number of total, alloted and unalloted police
- `'/zonecount'`, fetches the number of total, alloted and unalloted zones
- `'/allocation'`, fetches the allocation details like zone, police assigned to that zone and the time slot<br>

POST
`'/allocation'`
```
{
        "zone_name": "North Delhi",
        "police_name": "Aman",
        "time": "14:34:00",
        "date": "2020-07-25"
}
```
RESPONSE
```
{
        "id": 6,
        "zone_name": "North Delhi",
        "police_name": "Aman",
        "date_posted": "2020-07-16T09:01:26.637983Z",
        "time": "14:34:00",
        "date": "2020-07-25"
}
```
#### Note that, to fetch the details of the exact policeman / zone / allocation :
The ID can be spcified after the url like :
`'/allocation/2'`


