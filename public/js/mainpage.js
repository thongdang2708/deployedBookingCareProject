const inputsearchEl = document.getElementById('search-input')
let doctor_swiper_wrapper = document.querySelector('.doctor-swiper-wrapper');
let hospital_swiper_wrapper = document.querySelector('.hospital-swiper-wrapper');
let specialization_swiper_wrapper = document.querySelector('.specialization-swiper-wrapper');
const inputsearcharr = ['Search doctors', 'Search hospitals', 'Search specialization']

function randomplaceholder() {
    return Math.floor(Math.random() * inputsearcharr.length)
}

{/* <div class="swiper-slide">
<img src="https://assets.medpagetoday.net/media/images/97xxx/97507.jpg" alt="doctorcard" width="400" height="300">
<p>Dr. Linh Nguyen</p>
</div> */}

setInterval(() => {
    const randomnumber = randomplaceholder()
    inputsearchEl.placeholder = inputsearcharr[randomnumber]
}, 2000)


fetchDom();

async function fetchDom () {

    let res = await fetch('http://localhost:3000/api/alldoctors');

    let data = await res.json();

    let slicedData = data.slice(0,20);

    slicedData.forEach(data => {
        let newDiv = document.createElement('div');
        newDiv.classList.add('swiper-slide');
        newDiv.innerHTML = `
        <img src="${data.img}" alt="doctorcard" width="400" height="300">
        <p> ${data.first_name} ${data.last_name} </p>

        `

        doctor_swiper_wrapper.appendChild(newDiv);
    })

}


fetchDomTwo();

async function fetchDomTwo () {

    let res = await fetch('http://localhost:3000/api/hospital');

    let data = await res.json();

    let slicedData = data.slice(0,20);

    slicedData.forEach(data => {
        let newDiv = document.createElement('div');
        newDiv.classList.add('swiper-slide');
        newDiv.innerHTML = `
        <img src="${data.image}" alt="doctorcard" width="400" height="300">
        <p> ${data.hospitalname} </p>

        `

        hospital_swiper_wrapper.appendChild(newDiv);
    })

}

fetchDomThree();

async function fetchDomThree () {

    let res = await fetch('http://localhost:3000/api/allspecial');

    let data = await res.json();

    let slicedData = data.slice(0,20);

    slicedData.forEach(data => {
        let newDiv = document.createElement('div');
        newDiv.classList.add('swiper-slide');
        newDiv.innerHTML = `
        <img src="${data.image}" alt="doctorcard" width="400" height="300">
        <p> ${data.specialization_name} </p>

        `

        specialization_swiper_wrapper.appendChild(newDiv);
    })

}




