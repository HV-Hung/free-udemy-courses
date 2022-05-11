
      let apiUrl = "https://raw.githubusercontent.com/Huythanh0x/crawl_coupon_link/master/final_api.json";

      const data = fetch(apiUrl)
            .then((response) => {
            return response.json();
          });

      data.then((json) => {
          let courses = json["results"];
          let lastUpdate = document.querySelector('#last-update');
          lastUpdate.textContent=json["last_time_update"];
          displayCards(courses);
          
        })
        .catch((err) => {
          console.log(err);
        });
      //Set gia tri mac dinh cho cac buton radio
      document.getElementById("language1").checked = true;      
      document.getElementById("rating_option1").checked = true;    
      document.getElementById("level_option1").checked = true;
      document.getElementById("duration_option1").checked = true;
    

      //them them su kien khi change button radio 
      document.querySelectorAll("input[type='radio']").forEach((input) => {
        input.addEventListener('change', (e)=>{
        data.then((json) => {
          let courses = json["results"];
          displayCards(filterLanguage(filterRating(filterLevel(filterDuration(courses)))));
          
        })
        .catch((err) => {
          console.log(err);
        }); });
      });
 
      //Filter functions 
      const filterRating=(courses)=>{
        const filter = document.querySelector('input[name="radio-sub-component-rating"]:checked').value;
        return courses.filter(course => course["rating"]>= filter);
      }

      const filterLanguage=(courses)=>{
        const filter = document.querySelector('input[name="radio-sub-component-language"]:checked').value;
        if(filter == "1"){
          return courses.filter(course => course["locale"]== "English")
          }else{
            return courses;
          }
      }
      const filterLevel=(courses)=>{
        const filter = document.querySelector('input[name="radio-sub-component-level"]:checked').value;
        if(filter == "All Levels") return courses;
        return courses.filter(course => course["level"]== filter);
      }
      const filterDuration=(courses)=>{
        const filter = document.querySelector('input[name="radio-sub-component-duration"]:checked').value;
        switch(filter){
          case "0":
              return courses;
              break;
          case "2":
          return courses.filter(course => (course["duration"]/60<3));
              break;
          case "6":
          return courses.filter(course => (course["duration"]/60>=3 && course["duration"]/60<7));
              break;
          case "16":
          return courses.filter(course => (course["duration"]/60>=7 && course["duration"]/60<17));
              break;
          case "17":
          return courses.filter(course => (course["duration"]/60>=17 ));
              break;
        }
      }

      const displayCards=(courses)=>{
          const container_div = document.getElementById("container");

           today = new Date().getTime();
          container_div.innerHTML = "";
          for (let course of courses) {
            //tạo thẻ Ngày còn lại
            endTime = Date.parse(course["end_day"]);
            timeLeft = new Date(endTime - today);

            let remaining = document.createElement("div");
            remaining.classList.add("remaining_div");
            dayLeft =
              timeLeft.getDate() != 0
                ? timeLeft.getDate() - 1
                : timeLeft.getDate();
            remaining.textContent =
              dayLeft != 0
                ? dayLeft === 1
                  ? dayLeft + " day left"
                  : dayLeft + " days left"
                : timeLeft.getHours() === 1
                ? timeLeft.getHours() + " hour left"
                : timeLeft.getHours() + " hours left";

            //tạo thẻ tác giả
            let author = document.createElement("p");
            author.classList.add("author_div");
            auContent = course["author"];
            if (auContent != null) author.textContent = auContent;

            //tạo thẻ category
            let category = document.createElement("div");
            category.classList.add("category");
            category.textContent = course["Category"];

            //tạo thẻ review
            let review = document.createElement("div");
            review.classList.add("review");
            review.innerHTML = course["reviews"] + "✍";

            //tạo thẻ rating
            let rating = document.createElement("div");
            rating.classList.add("rating_div");
            rating.textContent = course["rating"] + "⭐";

            //tạo thẻ Img
            let img = document.createElement("img");
            img.src = course["preview_img"];
            img.setAttribute("width", "100%");

            //tạo khung card
            let box = document.createElement("div");
            box.classList.add("box");

            box.appendChild(document.createElement("span"));

            let content_div = document.createElement("div");
            content_div.classList.add("content");
            box.appendChild(content_div);

            //tao thẻ link
            let link = document.createElement("a");
            link.setAttribute("href", course["coupon_link"]);
            link.setAttribute("target", "_blank");

            //Thêm các thành phần vào card
            content_div.appendChild(img);
            let h2_title = document.createElement("h2");
            title = course["title"];
            h2_title.textContent = title;
            content_div.append(h2_title);
            content_div.appendChild(rating);
            if (auContent != null) content_div.appendChild(author);
            content_div.appendChild(remaining);
            content_div.appendChild(category);
            content_div.appendChild(review);
            link.appendChild(box);
            container_div.appendChild(link);
          }
        }