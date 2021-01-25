$(document).ready(function() {
  $('select').attr("class", "browser-default")
});

//Inicializador del elemento Slider
$("#rangoPrecio").ionRangeSlider({
  type: "double",
  grid: false,
  min: 0,
  max: 100000,
  from: 1000,
  to: 20000,
  prefix: "$"
})

function setSearch() {
  let busqueda = $('#checkPersonalizada')
  busqueda.on('change', (e) => {
    if (this.customSearch == false) {
      this.customSearch = true
    } else {
      this.customSearch = false
    }
    $('#personalizada').toggleClass('invisible')
  })
}

setSearch()






class BoogleSearch{
  constructor(){
    this.cityBox = document.querySelector('#ciudad');
    this.typeBox = document.querySelector('#tipo');
    this.priceBox = document.querySelector('#rangoPrecio');
    this.pers = document.querySelector('#checkPersonalizada');
  }

  Init(){
    this.AddOptions();
  }

  AddOptions(){
    var city = document.querySelector('#ciudad');
    var type = document.querySelector('#tipo');

    this.AjaxRequest('/info', 'GET', null)
        .done((data) => {

          // ORGANIZA LAS OPCIONES DE LAS CIUDADES
          var cities = [];
          for(var i = 0; i < data.length; i++){
            cities.push(data[i].Ciudad)
          };

          var filtrar = cities.filter(this.OnlyUnique);
          for(var i = 0; i < filtrar.length; i++){
            var option = document.createElement('option');
            option.innerHTML = filtrar[i];
            option.value = filtrar[i];

            city.appendChild(option)
          }

          // ORGANIZA LAS OPCIONES DEL TIPO
          var types = [];
          for(var i = 0; i < data.length; i++){
            types.push(data[i].Tipo)
          };
          
          var tiposFiltrados = types.filter(this.OnlyUnique);
          for(var i = 0; i < tiposFiltrados.length; i++){
            var option = document.createElement('option');
            option.innerHTML = tiposFiltrados[i];
            option.value = tiposFiltrados[i];

            type.appendChild(option)
          }

        }).fail((err) => {
          alert("Cant")
        })
  }

  OnlyUnique(value, index, self){
    return self.indexOf(value) === index;
  }

  Search(){
    var persSearch = this.pers.checked;

    if(persSearch){

      var vals = {
        cityFilter: this.cityBox.value,
        typeFilter: this.typeBox.value,
        prices: this.priceBox.value,
      }
  
      var { cityFilter, typeFilter, prices } = vals,
          range = prices.split(';'),
          min = range[0],
          max = range[1];
      
      this.AjaxRequest('/info', 'POST', {
        city: cityFilter,
        type: typeFilter,
        min: min, 
        max: max,
        isFilter: persSearch
      }).done((data) => {
        this.RenderInfo(data)
      }).catch((err) => {
        console.error(err)
      })


    }else{
      this.AjaxRequest('/info', 'GET', null)
          .done((data) => {
            this.RenderInfo(data)
          }).fail((err) => {
            console.error(err);
          })

    }

  }

  RenderInfo(arr){
    var infoList = document.querySelector("#infoList");
    infoList.innerHTML = "";

    if(arr.length > 0){
      for(var i = 0; i < arr.length; i++){
        var div = document.createElement('div');
        var template = `
            <div class="card-image">
              <img src="img/home.jpg">
            </div>
            <div class="card-stacked">
              <div class="card-content">
                <div>
                  <b>Direccion: </b><p>${arr[i].Direccion}</p>
                </div>
                <div>
                  <b>Ciudad: </b><p>${arr[i].Ciudad}</p>
                </div>
                <div>
                  <b>Telefono: </b><p>${arr[i].Telefono}</p>
                </div>
                <div>
                  <b>Código postal: </b><p>${arr[i].Codigo_Postal}</p>
                </div>
                <div>
                  <b>Precio: </b><p>${arr[i].Precio}</p>
                </div>
                <div>
                  <b>Tipo: </b><p>${arr[i].Tipo}</p>
                </div>
              </div>
              <div class="card-action right-align">
                <a href="#">Ver más</a>
              </div>
            </div>
        `;
        div.className = 'card horizontal';
        div.innerHTML = template;
        infoList.appendChild(div);
      }
    }
    else{
      var div = document.createElement('div');
        var template = `
            <div class="card-stacked">
              <h1>No se encontraron resultados...</h1>
            </div>
        `;
        div.className = 'card horizontal';
        div.innerHTML = template;
        infoList.appendChild(div);
    }
  }

  AjaxRequest(url, method, data){
    return $.ajax({
      url: url,
      method: method,
      data: data
    })
  }

}

var buscador = new BoogleSearch();
buscador.Init();

$('#buscar').on('click', () => {
  buscador.Search();
})