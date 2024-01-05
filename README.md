# How to update the website

The website is dynamically updated by reading .json files stored inside the data folder. Each of these files tackles a different aspect of the website.

Let us go through each one of them.

## News

The website shows the last three news on the main page. The rest of the news can be found on the news page (by clicking on the "News Archive" button).

Each news is described as follows:

```json
{
    "title": "Title of the NEWS",
    "image": "path to the image to put inside the news (if no image is present, please add ./images/news/default.jpg)",
    "abstract": "The abstract of the news, this must be short and cut to the point",
    "content": "The actual content of the news, which will be shown in the card appearing once the news is clicked"
}
```

To be added in news.json.

REMEMBER: Each item in the list has to be separated by a comma (",").

The news are loaded in order. Thus, the first three in the list will be ones showed on the main page (the rest in the supporting web page dedicated to all other news). 

SO, THE NEWS SHOULD BE ADDED IN THE HEAD OF THE LIST

## Seminars

Same reasoning follows for the seminars. The three most recent seminars are shown on the website, while the others can be found in the archive (pressing on the "Seminars Archive" button). Also here, the order is important (i.e., the most recent seminars should be added in the head of the list).

Example of seminar:

```json
{
    "title": "Title of the seminar",
    "speaker": "The speacker",
    "affiliation": "His/Her affiliation",
    "abstract": "The abstract of the talk, this can be as long as we want.",
    "bio": "The bio of the speaker, this can be as long as we want",
    "image": "A picture of the speaker, or about the topic of the seminar to be stored inside the images/seminars folder (put ./images/seminars/default.jpg if no image is present)",
    "when": "Full date of the seminar",
    "where": "Where the seminar is going to be"
}
```

To be added in seminars.json.

## Courses

Similar to the previous ones, we may find the courses. Differently from before, courses are not ordered, and are picked randomly (to be as fair as possible). Which means, three courses are picked randomly every time the page is loaded, and are shown on the main page (while the rest are available at their dedicated page thorugh the "All courses" button).

Example of course:

```json
{
    "type": "Type of course (eg. PhD Course, Master course, and so on)",
    "title": "The title of the course",
    "teacher": "The teacher(s) of the course",
    "department": "The department in which the course is done",
    "abstract": "The full description of the course (as long as you want)",
    "image": "A picture representing the course (put ./images/courses/default.jpg if no image is present)",
    "requirements": "The prerequisites of the course",
    "target": "The target students of the course",
    "email": "The teacher's contact email"
}
```

To be added in courses.json.

## People

Last, but not least, we may find the people of FORMA. So, who is part of the group. The list of people on the main page is always fully loaded, so everyone is on the main page.

Example of person:

```json
{
    "name": "Name",
    "surname": "Surname",
    "affiliation": "Affiliation",
    "role": "Position",
    "image": "A photo to be added in the images/people folder (put ./images/people/default.jpg if no photo is available)",
    "url": "url to personal website",
    "bib": "url to DBLP, this is used for creating the publications webpage"
}
```

To be added in people.json.

Note that, differently from all the rest, the publications page is not populated automatically (only semi-automatically). Indeed, when a new person is added in people.json, we need to manually update publications.html by copying and pasting an additional accordion HTML tag. In such a copy, we need to change the ID of the tags (with the proper number) and update the bibbase url (with the DBLP one).
