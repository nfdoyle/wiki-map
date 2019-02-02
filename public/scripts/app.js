
function containsEncodedComponents(x) {
  x.split('%20').join(' ');
  return x
}

function saveData() {
  console.log("saving data!");
  let mapObj = {};
  let latlng = marker.getPosition();

  mapObj.name = containsEncodedComponents(document.getElementById('name').value);
  mapObj.address = containsEncodedComponents(document.getElementById('address').value);
  mapObj.type = document.getElementById('type').value;
  mapObj.lat =  latlng.lat();
  mapObj.long = latlng.lng();
  mapObj.imgsrc = document.getElementById('img-url').value;
  mapObj.contributorid = 'dummy';
  mapObj.mapid = 'dummy';


  console.log(mapObj);
  $('#message').css('visibility', 'visible');
}

function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
      new ActiveXObject('Microsoft.XMLHTTP') :
      new XMLHttpRequest;

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request.responseText, request.status);
    }
  };

  request.open('GET', url, true);
  request.send(null);
}

function doNothing () {
  console.log('Nothing done! Wait...shit');
}

$(() => {

  initMap();

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
      $('.maplist-container').prepend($map); 
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
        $('#meta-pane').data({id: creatorId});
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
        $('.maplist-container')[0].innerHTML = '';
        renderMaps(maps);
      });;
    });
    $('#profile-body').find('button:nth-of-type(3)').on('click', function() {
      console.log(`button THREE clicked on user ${$('#profile-header').data().id}'s profile`);
    });
  }

  getAllMaps();
  populateMarkers(testMarkers);
//  END OF app.js  //
});
