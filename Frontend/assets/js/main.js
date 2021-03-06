function quit() {
    window.close();
  }
  // resets the page
  function reset() {
    window.location.reload();
  }
  async function getByCompanyName() {
    try {
      const params = new URLSearchParams();
      params.append("companyName", document.getElementById("toSearch").value);
      const response = await axios.post(
        `http://localhost:3000/getByCompanyName`,
        params
      );
      const responseJson = response.data;
      // console.log(responseJson);
      var arr = [];
      for (var i = 0; i < responseJson.length; i++) {
        arr.push(responseJson[i]["Company Name"]);
      }
      var selectFrom = document.createElement("h3");
      selectFrom.innerHTML = "Select from the below list for a precise result";
      var temp = 0;
      if (temp == 0) {
        document.getElementsByTagName("form")[0].appendChild(selectFrom);
        temp++;
      }
      var select = document.createElement("select");
      select.setAttribute("id", "select");
      // select List code
      for (var i = -1; i < arr.length; i++) {
        if (i == -1) {
          var option = document.createElement("option");
          option.setAttribute("value", "Select from below list");
          option.appendChild(document.createTextNode("Select from the list"));
          select.appendChild(option);
          option.setAttribute("selected", "selected");
          option.setAttribute("disabled", "disabled");
        } else {
          var option = document.createElement("option");
          option.setAttribute("value", arr[i]);
          select.setAttribute("onchange", "display(this.value);");
          option.appendChild(document.createTextNode(arr[i]));
          select.appendChild(option);
        }
      }
      document.getElementsByTagName("form")[0].appendChild(select);
      // console.log(`GET:`, responseJson);
      return responseJson;
    } catch (errors) {
      console.error(errors);
    }
  }
  async function display(cafeName) {
    const params = new URLSearchParams();
    params.append("companyName", cafeName);
    const response = await axios.post(
      `http://localhost:3000/getByCompanyName`,
      params
    );
    const responseJson = response.data;
    console.log(responseJson);
    var hr = document.createElement("hr");
    document.getElementsByTagName("form")[0].appendChild(hr);
    var nameText = document.createElement("h3");
    nameText.innerHTML = responseJson[0]["Company Name"];
    document.getElementsByTagName("form")[0].appendChild(nameText);
    var addressText = document.createElement("h3");
    addressText.innerHTML = responseJson[0]["Address"];
    document.getElementsByTagName("form")[0].appendChild(addressText);
    var phoneText = document.createElement("h3");
    phoneText.innerHTML = responseJson[0]["Phone"];
    document.getElementsByTagName("form")[0].appendChild(phoneText);

    // work on image here
    getImageByObjectID(responseJson[0]["_id"]);

    document.getElementsByTagName("form")[0].appendChild(hr);
    var commentLabel = document.createElement("h3");
    commentLabel.innerHTML = "Add a comment";
    document.getElementsByTagName("form")[0].appendChild(commentLabel);
    var commentText = document.createElement("textarea");
    commentText.setAttribute("rows", "4");
    commentText.setAttribute("id", "comment");
    commentText.setAttribute("cols", "50");
    commentText.setAttribute("name", "comment");
    document.getElementsByTagName("form")[0].appendChild(commentText);
    var commentInputButton = document.createElement("input");
    commentInputButton.setAttribute("type", "button");
    commentInputButton.setAttribute("id", "comment-add");
    console.log(responseJson[0]["_id"]);
    var id = responseJson[0]["_id"];
    commentInputButton.onclick = function () {
      setCafeComment(id);
    };
    commentInputButton.setAttribute("value", "Add Comment");
    document.getElementsByTagName("form")[0].appendChild(commentInputButton);
    document.getElementsByTagName("form")[0].appendChild(hr);
    var commentPrevious = document.createElement("h2");
    commentPrevious.innerHTML = "Previous comments";
    document.getElementsByTagName("form")[0].appendChild(commentPrevious);
    
    getCommentsByID(id);
  }
  
  // get image from the database
  async function getImageByObjectID(objectId) {
    const params = new URLSearchParams();
    params.append("objectId", objectId);
    const response = await axios.post(
      `http://localhost:3000/getImageByObjectID`,
      params
    );
    const responseJson = response.data;
    console.log(responseJson);
    
    setTimeout(() => {
      var img = document.createElement("img");
      img.setAttribute("src", "../images/outputFile.png");
      img.setAttribute("width", "100%");
      img.setAttribute("height", "100%");
      document.getElementById('img-container').appendChild(img);
    }, 1500);
  }

  async function setCafeComment(objectId) {
    comment = document.getElementById("comment").value;
    console.log(objectId);
    const params = new URLSearchParams();
    params.append("objectId", objectId);
    params.append("comment", comment);
    const responseJSON = await axios.post(
      `http://localhost:3000/setCafeComment`,
      params
    );
    var h3 = document.createElement("h3");
    h3.innerHTML = "Comment added successfully";
    document.getElementById('comment-add').insertAdjacentElement('afterend', h3);
  }
  
  async function getCommentsByID(cafeObjectId) {
    const params = new URLSearchParams();
    params.append("cafeID", cafeObjectId);
    const response = await axios.post(
      `http://localhost:3000/getCommentsByID`,
      params
    );
    const responseJson = response.data;
    console.log(responseJson);
    var div = document.createElement("div");
    div.setAttribute("id", "scroll-comments");
    for(var i=responseJson.length-1; i>=0; i--){
      var commentText = document.createElement("h3");
      commentText.setAttribute("style", "color: yellow");
      commentText.innerHTML = responseJson[i]["comment"];
        div.appendChild(commentText);
    //   document.getElementsByTagName("form")[0].appendChild(commentText);
    }
    document.getElementsByTagName("form")[0].appendChild(div);

  }
  