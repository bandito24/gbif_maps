let input = document.getElementById("taxon-key-input");
      let button = document.getElementById("submit-button");
      let map = L.map("map").setView([43.4200248, 5.4265362], 1);

const showName = document.getElementById('show-name')

    const getPlantWithId = async () => {
        const plantId = input.value
        const data = await fetch(`https://api.gbif.org/v1/species/${plantId}`)
        const jsonResults = await data.json()
        let results = jsonResults.canonicalName
        showName.innerHTML = `The GBIF given name for taxon ID# ${plantId} is ${results}`
    }



      L.tileLayer('https://tile.gbif.org/3857/omt/{z}/{x}/{y}@1x.png?style=osm-bright', {
        attribution: 'Map data &copy; <a href="https://gbif.org">GBIF</a>'
      }).addTo(map);

      button.addEventListener("click", function() {
        let taxonKey = input.value;
        map.eachLayer(function (layer) {
            if (layer.options.layers === "polygonLayer") {
                map.removeLayer(layer);
            }
        });
        let polygonLayer = L.tileLayer('https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?style=classic.poly&bin=hex&hexPerTile=40&taxonKey=' + taxonKey, {layers: "polygonLayer"});
        polygonLayer.addTo(map);
      });

      button.addEventListener("click", getPlantWithId)


const nameSubmit = document.getElementById('name-submit')
const nameInput = document.getElementById('name-input')
const showId = document.getElementById('show-id')
let keyToUse
let taxonKey;


    const getName = async () => {
    let searchedName = nameInput.value
    searchedName = searchedName.split(' ')
    const genus = searchedName[0]
    const species = searchedName[1]
    const data = await fetch(`https://api.gbif.org/v1/species?name=${genus}%20${species}`)
    const jsonData = await data.json()
    const result = jsonData.results[0].key
    showId.innerHTML = `GBIF Taxon ID for ${genus} ${species} is ${result}`
    keyToUse = result
    taxonKey = keyToUse;
    map.eachLayer(function (layer) {
        if (layer.options.layers === "polygonLayer") {
            map.removeLayer(layer);
        }
    });
    let polygonLayer = L.tileLayer('https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?style=classic.poly&bin=hex&hexPerTile=40&taxonKey=' + taxonKey, {layers: "polygonLayer"});
    polygonLayer.addTo(map);
}


nameSubmit.addEventListener('click', getName)



const mapSelect = document.getElementById('map-select')

function changeMapStyle(e){
    let style = e.target.value
    if(keyToUse){
        taxonKey = keyToUse
    } else {
        taxonKey = input.value
    }
    let apiToFetch = `https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?style=${style}&bin=hex&hexPerTile=30&taxonKey=${taxonKey}`
    map.eachLayer(function (layer) {
        if (layer.options.layers === "polygonLayer") {
            map.removeLayer(layer);
        }
    });
    var polygonLayer = L.tileLayer(apiToFetch);
    polygonLayer.addTo(map);
}










mapSelect.addEventListener('change', changeMapStyle)



// button.addEventListener("click", function() {
//     let taxonKey = input.value;
//     var polygonLayer = L.tileLayer('https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?style=fire.point&taxonKey=' + taxonKey);
//     polygonLayer.addTo(map);
//   });