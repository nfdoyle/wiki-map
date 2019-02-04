const login = false;


function containsEncodedComponents(x) {
  x.split('%20').join(' ');
  return x
}

function saveData() {
  console.log("saving data!");
  let markerObj = {};
  let latlng = marker.getPosition();

  markerObj.name = containsEncodedComponents(document.getElementById('name').value);
  markerObj.address = containsEncodedComponents(document.getElementById('address').value);
  markerObj.type = document.getElementById('type').value;
  markerObj.description = document.getElementById('description').value;
  markerObj.lat =  latlng.lat();
  markerObj.long = latlng.lng();
  markerObj.imgsrc = document.getElementById('imgsrc').value;
  markerObj.contributorid = $('#meta-pane').data().id;
  markerObj.mapid = $('#meta-pane').data().mapid;

  $('#message').css('visibility', 'visible');

  $.ajax({
    method: "POST",
    url: '/api/markers',
    data: markerObj
  }).done (() => {
    console.log(`Marker with name: ${markerObj.name} added`);
  });
}

function deleteLocationData() {
  console.log('delete buttoned!');
}

function editLocationData(value) {
  console.log($('.location-info')[0].innerHTML);
  let input = value;
  let values = input.split('$');
  console.log(values[1]);
  let editObj = {};
  editObj.id = values[1];
  
  const newContent = `
  <div style="width: 260px; height: 200px; padding: 1px; float:left">
  <form>
        <table>
        <tr><td>Name:</td> <td><input type='text' id='name'/> </td> </tr>
        <tr><td>Address:</td> <td><input type='text' id='address'/> </td> </tr>
        <tr><td>Description:</td> <td><input type='text' id='description'/> </td> </tr>
        <tr><td>Image URL:</td> <td><input type='text' id='imgsrc'/> </td> </tr>
        <tr><td>Type:</td> <td><select style='float: right' id='type'> +
                    <option value='Food' SELECTED>Food</option>
                    <option value='Entertainment'>Entertainment</option>
                    <option value='Entertainment'>Nature</option>
                    <option value='Custom'>Custom</option>
                    </select> </td></tr>           
                    <tr><td></td>
                    <div style='display: inline-block'> 
                      <td><input type='button' value='Save' onclick='saveData()'/>
                      <!-- <input type='button' value='Edit' onclick='doNothing()'/>
                      <input type='button' value='Save' onclick='doNothing()'/></td> -->
                      <td></td>
                    </div>
                  </tr>
                    <!-- onclick='saveData()'--> 
        </table>
        <div style='visibility: hidden' id="message">Location saved</div>
        
      <form></div>`

  if (values[0] === 'edit') {
    $('.location-info')[0].innerHTML = newContent;
  }
    //   $.ajax({
  //     method: "PUT",
  //     url: `/api/markers/${values[1]}`,
  //     data: editObj
  //   }).done(() => {
  //     console.log(`${editMarker} changed`);
  //     // $("<div>").text(user.name).appendTo($("body"));
  //   });;
  // }
  // if (values[0] === 'delete') {
  //   $.ajax({
  //     method: "DELETE",
  //     url: `/api/markers/${values[1]}`,
  //     data: editObj
  //   }).done(() => {
  //     console.log(`${editMarker} changed`);
  //     // $("<div>").text(user.name).appendTo($("body"));
  //   });;
  // }
}

function doNothing () {
  console.log('Nothing done! Wait...shit');
}

$(() => {
  let siteUser;

  initMap();

  if (!login) {
    console.log("NOT LOGGED IN");
  }

  //initialize window
  $('#login-pane').slideUp(`fast`, function(){
    $(this).css("visibility", "visible");
  });

  $('#edit-btn').on('click', function(event) {  
    console.log('edit buttoned');
  });

  $('#delete-btn').on('click', function(event) {
    console.log('delete buttoned');
  });

  $('#login-btn').on('click', () => {
    console.log('login pressed!');
    $('#login-pane').slideToggle('slow', () => {});
    
  });

  $('#toggle-profile-panel').on('click', () => {
    $('#profile-toggle').slideToggle('slow', () => {});
  });
  
  let testMap = {
    creatorid: 1,
    handle: "DemoDan",
    imgsrc: "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
    id: 1,
    likes: 5,
    city: 'Victoria',
    name: "Places I Hate",
    startlat: 48.422,
    startlong: -123.362,
    type: "Custom"
   }
 
  function createMapEntry(mapObject){
    //do biz
    const article = $('<article>').addClass("maplisting");
    article.data("mapid", mapObject.id)
    .data("creatorId", mapObject.creatorid);
    
    const avatar = $('<img>').addClass("logo").attr('src', mapObject.avatar).attr('width', '50px').attr('height', '50px').appendTo(article);
    const h3 = $('<h3>').text(mapObject.name).appendTo(article);
    const footer = $('<footer>').appendTo(article);
    const h4_1 = $('<h4>').text(mapObject.handle).appendTo(footer);
    const h4_2 = $('<h4>').text(mapObject.city).appendTo(footer);
    const h4_3 = $('<h4>').text(mapObject.type).appendTo(footer);
    return article
  }

  // Render maps to browser pane
  function renderMaps(dataObj){
    for (const obj of dataObj) {
      var $map = createMapEntry(obj);
      if (obj.id == 4) $('.maplist-container').prepend($map); 
    }   
    attachMapClickListener();
  }

  // *** MAP AJAX FUNCTIONS ***

  // GET ALL MAPS - render maps to browser pane
  const getAllMaps = () => {
    $.ajax({
      method: "GET",
      url: "/api/maps"
    }).done((maps) => {
      console.log('AJAX GET MAPS DONE');
      renderMaps(maps);
    });;
  }

  // GET 1 MAP AND ALL MARKERS - render map to map window
  const attachMapClickListener = () => {
    $('.maplisting').on('click', function() {
      const title = $(this).find('h3')[0].innerText;
      const handle = $(this).find('h4')[0].innerText;
      const avatar = $(this).find('img')[0].currentSrc;
      const {mapid, creatorId} = $(this).data();
      $.ajax({
        method: "GET",
        url: `/api/maps/${mapid}`
      }).done((markers) => {
        console.log('AJAX GET MARKERS DONE');
        console.log(markers);
        $("#meta-pane").find('h3')[0].innerHTML = `<img src = ${avatar}></img>${handle}`;
        $('#meta-pane').find('h2')[0].innerHTML = `${title}`;
        $('#meta-pane').data({id: creatorId, mapid});
        attachMetaPaneHandleListener();
        populateMarkers(markers);
      });;
    });
  }

  // *** USER AJAX FUNCTIONS ***

  // GET A USER - render details to profile pane
  const attachMetaPaneHandleListener = () => {
    ($('#meta-pane').find('a')).on('click', function() {
      const userId = $(this).parent().parent().data().id;
      $.ajax({
        method: "GET",
        url: `/api/users/${userId}`,
      }).done((user) => {
        console.log("GET USER DONE")
        $('#profile-header').find('img')[0].src =`${user.avatar}`; 
        $('#profile-header').find('h3')[0].innerText =`${user.handle}`;
        $('#profile-header').data({id: `${user.id}`});
        attachProfileButtonListeners();
      }); 
    });
  }

  // GET USER FROM LOGIN
  $('.submit-button').on('click', function(event) {
    event.preventDefault();
    document.cookie = "handle=DemoDan";
    $('#login-pane').slideUp(`fast`);
    $.ajax({
      method: "POST",
      url: "/login",
    }).done(function(user) {
      console.log(user);
      //get profile
      $('#profile-header').find('img')[0].src =`${user.avatar}`; 
      $('#profile-header').find('h3')[0].innerText =`${user.handle}`;
      $('#profile-header').data({id: `${user.id}`});
      attachProfileButtonListeners();

    });
  });

  // GET A USER'S MAPS - render maps to browser pane
  const attachProfileButtonListeners = () => {
    const {id} = $('#profile-header').data();
    $('#profile-body').find('button:nth-of-type(1)').on('click', function() {
      $.ajax({
        method: "GET",
        url: `/api/users/${id}/maps`
      }).done((maps) => {
        $('.maplist-container')[0].innerHTML = '';
        renderMaps(maps);
      });;
    });
    
    $('#profile-body').find('button:nth-of-type(2)').on('click', function() {
      $.ajax({
        method: "GET",
        url: `/api/users/${id}/maps/contributed`
      }).done((maps) => {
        console.log(maps);
        $('.maplist-container')[0].innerHTML = '';
        renderMaps(maps);
      });;
    });
    $('#profile-body').find('button:nth-of-type(3)').on('click', function() {
      console.log(`button THREE clicked on user ${$('#profile-header').data().id}'s profile`);
    });
  }

  getAllMaps();
 
//  END OF app.js  //
});
