# How to update the FORMA website

Open the relevant file in `data/`, copy an existing entry, and edit its fields.
Save the file and reload the page to preview the change. To publish on GitHub
Pages, commit the edited file and any new images or slides.
The same files are used online and when you open the site directly from disk.
For a local preview, extract the full archive and open `index.html` in your
browser. Updating the contents only requires a text editor.

| Content | File |
| --- | --- |
| News | `data/news.js` |
| Seminars | `data/seminars.js` |
| Courses | `data/courses.js` |
| Members and their DBLP profiles | `data/people.js` |

Each file contains a list inside `FormaData.register("…", [ … ]);`. Keep
that wrapper in place. Separate entries with commas and keep the
double quotes around field names and values. For a literal double quote
inside a value, write `\"`. Paths such as `./images/people/name.jpg` are
relative to the website root.

## News

Add the latest item at the beginning of the list in `data/news.js`. The
homepage shows the first three items and the News Archive shows the full list.

```js
{
    "title": "News title",
    "image": "./images/news/default.jpg",
    "abstract": "Short summary for the card.",
    "content": "Full text shown when the card is opened."
}
```

Put any new images in `images/news/`. The `content` field supports HTML.

## Seminars

Add the latest seminar at the beginning of the list in `data/seminars.js`.
The homepage shows the first three seminars and the Seminars Archive shows
the full list.

```js
{
    "title": "Seminar title",
    "speaker": "Speaker One, Speaker Two",
    "affiliation": "University One and University Two",
    "abstract": "Abstract of the seminar.",
    "bio": "Short biographies of the speakers.",
    "image": "./images/seminars/default.jpg",
    "date": "2027-02-15",
    "time": "14:00",
    "where": "Valletta Puggia, Room 322",
    "slides": "./data/slides/seminar-slides.pdf"
}
```

Use `YYYY-MM-DD` for the date and 24-hour `HH:MM` for the local start time.
Omit `time` or `slides` when that information is unavailable. Put new seminar
images in `images/seminars/` and slide PDFs in `data/slides/`.

Paolo Rosso’s portrait comes from his [AESLA 2024 speaker profile](https://aesla2024.upv.es/eng/biodata/rosso.html).

## Courses

Add each course to `data/courses.js`. Three courses are selected at random
for the homepage and the All Courses page shows the full list.

```js
{
    "type": "PhD Course",
    "title": "Course title",
    "teacher": "Instructor name",
    "department": "DIBRIS",
    "abstract": "Course description.",
    "image": "./images/courses/course-cover.svg",
    "requirements": "Prerequisites for the course.",
    "target": "MSc and PhD students",
    "email": "instructor@example.org"
}
```

Save the cover in `images/courses/` and use an image or illustration specific
to the course.

## People

Add members to `data/people.js`. Each entry appears on the homepage in the
same order as in the file.

```js
{
    "name": "First name",
    "surname": "Last name",
    "affiliation": "Department and university",
    "role": "Position",
    "image": "./images/forma_logo.png",
    "url": "https://example.org/profile",
    "bib": "https://dblp.org/pid/z/EZucca"
}
```

Put verified portraits in `images/people/`. Use `./images/forma_logo.png`
when no verified photo is available. Omit `bib` for a member without a DBLP
profile.

## Publications

The Publications page lists members who have a DBLP profile. Put the member's
persistent profile URL or its `.bib` export URL in the `bib` field. When the
site is served over HTTP or HTTPS, opening a bibliography retrieves records
from 2020 onwards directly from [DBLP](https://sparql.dblp.org/).

For offline use or when DBLP is temporarily unavailable, the site reads the
saved records in `data/publications.js`. To refresh that copy:

1. Open `tools/refresh-publications.html` in a browser while online.
2. Click **Fetch from DBLP**, then **Download publications.js**.
3. Replace `data/publications.js` with the downloaded file and commit it to
   refresh the copy used on GitHub Pages.

Use the maintenance page over HTTP or HTTPS if your browser restricts online
requests from files opened directly from disk.
