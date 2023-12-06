function updateNews(limit) {
    fetch("./data/news.json")
            .then((res) => {
            return res.json();
        })
        .then((data) => {
            if(data.length == 0) {
                var jsonStr = 
                `{
                    "title": "No news",
                    "image": "./images/news/default.jpg",
                    "abstract": "Nothing new to report",
                    "content": "Nothing new to report"
                }`;
                data.push(JSON.parse(jsonStr));
            }
            data.forEach((element, index) => {
                if(limit && index >= limit) return;
                document.getElementById("newsDiv").innerHTML +=
                    "<div class=\"col d-flex align-items-stretch\"><button type=\"button\" class=\"btn\" data-bs-toggle=\"modal\" data-bs-target=\"#modalNews" + index + "\"><div class=\"card border-primary\"><img src=\"" + element["image"] +  "\" class=\"card-img-top\" alt=\"News\"><div class=\"card-body\"><h5 class=\"card-title\"><b>" + element["title"] + "</b></h5><p class=\"card-text\">" + element["abstract"] + "</p></div></div></div>";

                document.getElementById("modals").innerHTML += 
                    `<div class="modal fade" id="modalNews` + index + `" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">` + element["title"] + `</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                            ` + element["content"] + `
                            </div>
                        </div>
                        </div>
                    </div> `;
                });
            });
}

function updateSeminars(limit) {
    fetch("./data/seminars.json")
            .then((res) => {
            return res.json();
        })
        .then((data) => {
            if(data.length == 0) {
                var jsonStr = 
                `{
                    "title": "No title",
                    "image": "./images/seminars/default.jpg",
                    "abstract": "No abstract",
                    "bio": "No bio",
                    "speaker": "No speaker",
                    "affiliation": "No affiliation",
                    "when": "never",
                    "where: "nowhere"
                }`;
                data.push(JSON.parse(jsonStr));
            }
            data.forEach((element, index) => {
                if(limit && index >= limit) return;
                document.getElementById("seminarsDiv").innerHTML +=
                    "<div class=\"col\"><button type=\"button\" class=\"btn\" data-bs-toggle=\"modal\" data-bs-target=\"#modalSem" + index + "\"><div class=\"card border-primary\"><img src=\"" + element["image"] +  "\" class=\"card-img-top\" alt=\"Seminar\"><div class=\"card-body\"><h6 class=\"card-title\"><b>" + element["title"] + "</b></h6><i><p><h5>" + element["speaker"] + "</h5><h6>" + element["affiliation"] + "</h6><br><h5>" + element["when"] + "</h5><h5>" + element["where"] + "</h5></p></i></div></div></div>";

                document.getElementById("modals").innerHTML += 
                    `<div class="modal fade" id="modalSem` + index + `" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">` + element["title"] + `</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p>
                                    <h4>Abstract</h4>
                                    ` + element["abstract"] + `
                                </p>
                                <p>
                                    <h4>Bio</h4>
                                    ` + element["bio"] + `
                                </p>
                            </div>
                        </div>
                        </div>
                    </div> `;
                });
            });
}

function updateCourses(limit) {
    fetch("./data/courses.json")
            .then((res) => {
            return res.json();
        })
        .then((data) => {
            if(data.length == 0) {
                var jsonStr = 
                `{
                    "title": "None",
                    "teacher": "None",
                    "department": "None",
                    "image": "./images/courses/default.jpg",
                    "abstract": "None",
                    "type": "None"
                }`;
                data.push(JSON.parse(jsonStr));
            }
            limit = limit || data.length; 
            // var pickedIndex = Math.floor(Math.random() * (data.length - 1));
            for (var i = 0; i < limit; i++) { 
              var pickedIndex = i + Math.floor(Math.random() * (data.length - i));
              // pickedIndex = (pickedIndex + i); % data.length;  
              var element = data[pickedIndex]; 
              data[pickedIndex] = data[i]; 
              data[i] = element; 
              document.getElementById("coursesDiv").innerHTML +=
                  "<div class=\"col\"><button type=\"button\" class=\"btn\" data-bs-toggle=\"modal\" data-bs-target=\"#modalCourses" + i + "\"><div class=\"card border-primary\"><img src=\"" + element["image"] +  "\" class=\"card-img-top\" alt=\"Courses\"><div class=\"card-body\"><h5 class=\"card-title\">[" + element["type"] + "]<br><b>" + element["title"] + "</b><br><i>" + element["teacher"] + "</i></h5><h5>" + element["department"] + "</h5></div></div></div>";

              document.getElementById("modals").innerHTML += 
                  `<div class="modal fade" id="modalCourses` + i + `" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-scrollable">
                      <div class="modal-content">
                          <div class="modal-header">
                              <h5 class="modal-title" id="exampleModalLabel">` + element["title"] + `</h5>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                          ` + element["abstract"] + `
                          </div>
                      </div>
                      </div>
                  </div> `;
            }
          });
}

function updatePeople() {
    fetch("./data/people.json")
            .then((res) => {
            return res.json();
        })
        .then((data) => {
            if(data.length == 0) {
                var jsonStr = 
                `{
                    "name": "None",
                    "surname": "None",
                    "affiliation": "None",
                    "url": "None",
                    "image": "./images/people/default.jpg"
                }`;
                data.push(JSON.parse(jsonStr));
            }
            data.forEach(element => {
                document.getElementById("peopleDiv").innerHTML +=
                    `<div class="col-6 col-md-4 col-lg-3">
                        <div class="card h-100 border-primary">
                            <a href="` + element["url"] + `" target="_blank"><img src="` + element["image"] + `" class="card-img-top" alt="` + element["name"] + ` ` + element["surname"] + `"></a>
                            <div class="card-body text-center">
                                <h4 class="card-title">` + element["name"] + ` ` + element["surname"] + `</h4>
                                <p class="card-text">` + element["role"] + `<br>` + element["affiliation"] + `</p>
                            </div>
                        </div>                        
                    </div>`;
            });
        });
}
