let cl = console.log;

const movies_container = document.getElementById("movies_container");
const title_control = document.getElementById("title_control");
const desc_control = document.getElementById("desc_control");
const poster_control = document.getElementById("poster_control");
const rating_control = document.getElementById("rating_control");
const genre_control = document.getElementById("genre_control");
const release_control = document.getElementById("release_control");
const backdrop = document.getElementById("backdrop");
const movimodel = document.getElementById("movimodel");
const movie_form = document.getElementById("movie_form");
const add_btn = document.getElementById("add_btn");
const update_btn = document.getElementById("update_btn");
const form_heading = document.getElementById("form_heading");
const spinner = document.getElementById("spinner");

const showmoviemodel = document.querySelectorAll(".showmoviemodel");
showmoviemodel.forEach((ele) => ele.addEventListener("click", ontoggle));


function spinnerhandel(flag){
   if(flag){
    spinner.classList.remove("d-none");
   }
   else{
     spinner.classList.add("d-none")
   }
}



function ontoggle() {
  backdrop.classList.toggle("active");
  movimodel.classList.toggle("active");
  movie_form.reset();
  form_heading.innerText="Add Movie"
  add_btn.classList.remove("d-none")
  update_btn.classList.add("d-none")
}

const base_url = "https://posts-50d7d-default-rtdb.firebaseio.com/";

const movies_url =
  "https://posts-50d7d-default-rtdb.firebaseio.com/movies.json";

function nestedobjtoArr(obj) {
  for (const key in obj) {
    obj[key].id = key;
    state.moviesArr.unshift(obj[key]);
  }
}

let state = {
  moviesArr: [],
  edit_id: null,
};

function makeApicall(url, methodname, body) {
  body = body ? JSON.stringify(body) : (body = null);
  return fetch(url, {
    method: methodname,
    body: body,
    headerS: {
      "content-type": "application/json",
      auth: "JWT token",
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("err");
    }
    return res.json();
  });
}


function setrating(rat){
  if(rat >=8 && rat<=10){
    return "badge-success"
  }
  else if(rat >=5 && rat<8){
    return "badge-warning"
  }
  else{ return "badge-danger"
  }
}

function snackbar(titletext, Icon){
  Swal.fire({
  title: titletext,
  icon: Icon,
  draggable: true,
  timer:2000
});
}
  


function fetchmovies() {
  spinnerhandel(true)
  makeApicall(movies_url, "GET")
    .then((data) => {
      nestedobjtoArr(data);
      onread(state.moviesArr);
    })
    .catch((err) => {
      cl(err);
    })
    .finally(()=>{
      spinnerhandel()
    })
}

fetchmovies();

function onread(arr) {
  let result = "";
  arr.forEach((movi) => {
    result += `        
        <div class="col-sm-6 col-md-4 col-lg-3 mb-4" id="${movi.id}">
          <div class="card h-100 moviecard">
            <div class="card-header">
              <div class="row d-flex justify-content-between">
                <div class="col-10">
                  <h4 class="mb-0 movietitle">
                     ${movi.title}
                  </h4>
                  <small>Create At : ${new Date(movi.createAt).toLocaleString("en-IN")}</small><br>
                </div>
                <div class="col-2">
                  <h4 class="mb-0">
                    <span class="badge ${setrating(movi.rating)}">${movi.rating}</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="card-body py-0">
              <figure>
                <img
                  src="${movi.poster}"
                  title="${movi.title}"
                  alt="${movi.title}"
                />
                <figcaption>
                  <h4>${movi.title}</h4>
                  <p>${movi.description}</p>
                </figcaption>
              </figure>
            </div>
            <div class="card-footer">
             ${movi.updatedAt ? `<small class="">Update At : ${new Date(movi.updatedAt).toLocaleString("en-IN")} </small>` : ""} 
                <div class="mt-2 d-flex justify-content-between">
                 <button onclick="onedithand(this)" class="btn btn-info">Edit</button>
                 <button onclick="ondeletehand(this)" class="btn btn-danger">Remove</button>
                </div>
            </div>
          </div>
        </div>`;
  });
  movies_container.innerHTML = result;
}

function oncreate(eve) {
  spinnerhandel(true)
  eve.preventDefault();
  let newmovi_obj = {
    title: title_control.value,
    createAt: Date.now(),
    rating: rating_control.value,
    poster: poster_control.value,
    description: desc_control.value,
    updatedAt: null,
    genre: genre_control.value,
  };
   
  makeApicall(movies_url, "POST", newmovi_obj).then((data) => {
    snackbar(`Movie with id ${data.name} Added successfully`, "success")
    newmovi_obj.id = data.name;
    state.moviesArr.unshift(newmovi_obj);

    let col = document.createElement("div");
    col.className = "col-sm-6 col-md-4 col-lg-3 mb-4";
    col.id = data.name;
    col.innerHTML = `<div class="card h-100 moviecard">
            <div class="card-header">
              <div class="row d-flex justify-content-between">
                <div class="col-10">
                  <h4 class="mb-0 movietitle">
                     ${newmovi_obj.title}
                  </h4>
                  <small>Create At : ${new Date(newmovi_obj.createAt).toLocaleString("en-IN")}</small><br>
                </div>
                <div class="col-2">
                  <h4 class="mb-0">
                  <span class="badge ${setrating(newmovi_obj.rating)}">${newmovi_obj.rating}</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="card-body py-0">
              <figure>
                <img
                  src="${newmovi_obj.poster}"
                  title="${newmovi_obj.title}"
                  alt="${newmovi_obj.title}"
                />
                <figcaption>
                  <h4>${newmovi_obj.title}</h4>
                  <p>${newmovi_obj.description}</p>
                </figcaption>
              </figure>
            </div>
            <div class="card-footer">
             ${newmovi_obj.updatedAt ? `<small class="">Update At : ${new Date(newmovi_obj.updatedAt).toLocaleString("en-IN")} </small>` : ""} 
                <div class="mt-2 d-flex justify-content-between">
                 <button onclick="onedithand(this)" class="btn btn-info">Edit</button>
                 <button onclick="ondeletehand(this)" class="btn btn-danger">Remove</button>
                </div>
            </div>
          </div>`;
          movies_container.prepend(col)
          ontoggle()
  })
  .catch((err)=>{
    cl(err);
  })
  .finally(()=>{
    spinnerhandel()
  })
}

function ondeletehand(ele){
  Swal.fire({
  title: "Are you sure?",
  text: "You want to delete this movie!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "rgb(13, 202, 240)",
  cancelButtonColor: "rgb(220, 53, 69)",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
     spinnerhandel(true)
    let dlt_id= ele.closest(".col-sm-6").id
    let dlt_url =`${base_url}/movies/${dlt_id}.json`
    makeApicall(dlt_url,"DELETE")
    .then(data=>{
     let findidx= state.moviesArr.findIndex((ele)=> ele.id===dlt_id)
     state.moviesArr.splice(findidx,1)
     ele.closest(".col-sm-6").remove()
 })
  
  snackbar(`Your Movie with id ${dlt_id} deleted`, "success")
  } 
}).catch((err)=>{
   cl(err);
 }).finally(()=>{
   spinnerhandel()
 })
}




function onedithand(ele){
  ontoggle()
  spinnerhandel(true)
  form_heading.innerText="Update Movie"
  add_btn.classList.add("d-none");
  update_btn.classList.remove("d-none");
 let edit_id= ele.closest(".col-sm-6").id
 state.edit_id=edit_id;
 let edit_url= `${base_url}/movies/${edit_id}.json`

 makeApicall(edit_url,"GET")
 .then((data)=>{
  title_control.value= data.title
   rating_control.value = data.rating
   poster_control.value = data.poster
   desc_control.value = data.description
   genre_control.value = data.genre
 }) 
 .catch((err)=>{
  cl(err)
 })
 .finally(()=>{
  spinnerhandel()
 })
}


function onupdatehand(){
  spinnerhandel(true)
  let update_id=state.edit_id
  let old_obj= state.moviesArr.find((ele)=> ele.id=== update_id)
   let updated_obj= {
    title: title_control.value,
    createAt: old_obj.createAt,
    rating: rating_control.value,
    poster: poster_control.value,
    description: desc_control.value,
    updatedAt: Date.now(),
    genre: genre_control.value,
    id:update_id
   }
   let update_url=`${base_url}/movies/${update_id}.json`
   makeApicall(update_url,"PATCH",body=updated_obj)
   .then((data)=>{
    let findidx= state.moviesArr.findIndex((ele)=>ele.id===update_id)
    state.moviesArr[findidx]=updated_obj;
    let update_col=document.getElementById(update_id);
    update_col.innerHTML=`<div class="card h-100 moviecard">
            <div class="card-header">
              <div class="row d-flex justify-content-between">
                <div class="col-10">
                  <h4 class="mb-0 movietitle">
                     ${updated_obj.title}
                  </h4>
                  <small>Create At : ${new Date(updated_obj.createAt).toLocaleString("en-IN")}</small><br>
                </div>
                <div class="col-2">
                  <h4 class="mb-0">
                    <span class="badge ${setrating(updated_obj.rating)}">${updated_obj.rating}</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="card-body py-0">
              <figure>
                <img
                  src="${updated_obj.poster}"
                  title="${updated_obj.title}"
                  alt="${updated_obj.title}"
                />
                <figcaption>
                  <h4>${updated_obj.title}</h4>
                  <p>${updated_obj.description}</p>
                </figcaption>
              </figure>
            </div>
            <div class="card-footer">
             ${updated_obj.updatedAt ? `<small class="">Update At : ${new Date(updated_obj.updatedAt).toLocaleString("en-IN")} </small>` : ""} 
                <div class="mt-2 d-flex justify-content-between">
                 <button onclick="onedithand(this)" class="btn btn-info">Edit</button>
                 <button onclick="ondeletehand(this)" class="btn btn-danger">Remove</button>
                </div>
            </div>
          </div>
    `
    snackbar(`Movie with id ${update_id} Updated successfully`,"success" )
   }).catch((err)=>{
    cl(err)
   }).finally(()=>{
      spinnerhandel()
     ontoggle();
   })
}



update_btn.addEventListener("click",onupdatehand)
movie_form.addEventListener("submit", oncreate);
