let nav_bar = document.getElementById('nav-bar');
let navigation_bar = document.querySelector('.navigation-bar');
let navigation_container = document.querySelector('.navigation-container');
let header = document.getElementById('header');
let doctor_title = document.querySelector('.doctor-title');
let buttonBtn = document.getElementById('button');
let place_input = document.getElementById('place-input');
let doctor_id = 2;
let doctor_name_El = document.querySelector('.doctor-name');
let doctor_background = document.querySelector('.doctor-background');
let training_experience_list = document.querySelector('.training-experience-list');
let doctor_image = document.querySelector('.doctor-image');
let practical_experience_list = document.querySelector('.practical-experience-list');
let feedback_list = document.querySelector('.feedback-list');
let hospital_name = document.querySelector('.hospital-name');
let hospital_address = document.querySelector('.hospital-address');


nav_bar.addEventListener('click', (ed) => {
    ed.preventDefault();

    navigation_bar.classList.add('active');
    navigation_container.classList.add('active');
    buttonBtn.disabled = true;
    place_input.setAttribute('disabled', true);
})




navigation_bar.addEventListener('click', () => {

    navigation_bar.classList.remove('active');
    navigation_container.classList.remove('active');
    buttonBtn.disabled = false;
    place_input.setAttribute('disabled', false);
})

scrollEffect()

function scrollEffect () {
    let bottom = header.getBoundingClientRect().bottom;

    let bottomOne = bottom - 10;
    
    let topButton = buttonBtn.getBoundingClientRect().top;

    
    


    window.addEventListener('scroll', () => {

        let {scrollTop} = document.documentElement;

        if (scrollTop >= bottomOne) {
            showLoading();
        } else if (scrollTop <= 10) {
            dropLoading();
        } 
        console.log(scrollTop);
        if (scrollTop > topButton + 15 ) {
            disableSearchButton();
        } else if (scrollTop < topButton + 15) {
            undisableSearchButton();
        }
    })
}

function disableSearchButton() {

    buttonBtn.disabled = true;
    buttonBtn.style.backgroundColor = '#fff';
    buttonBtn.classList.add('hidden');
}

function undisableSearchButton () {
    buttonBtn.disabled = false;
    buttonBtn.classList.remove('hidden');
}
function dropLoading () {

    doctor_title.innerText = '';
}

async function showLoading () {

    let res = await fetch(`http://localhost:3000/api/onlydoctor/${doctor_id}`);

    let data = await res.json();

    let { first_name, last_name, practical_experience } = data[0];

    doctor_title.innerText = first_name + ' ' + last_name + ' || ' + 'Specialized Doctor';
}   


showInformation();

async function showInformation () {
    
    let res = await fetch(`http://localhost:3000/api/onlydoctor/${doctor_id}`);

    let data = await res.json();

    let { first_name, last_name, practical_experience, img, training_experience } = data[0];

    doctor_name_El.innerText = first_name + ' ' + last_name + ' || ' + 'Specialized Doctor';
    doctor_background.innerText = practical_experience;
    doctor_image.src = img;


    let fixedExperience = practical_experience.split('@');

    fixedExperience.forEach(expe => {

        let li = document.createElement('li');
        li.classList.add('training-experience-element');
        li.innerHTML = `
            ${expe}
        `

        training_experience_list.appendChild(li);
    })

    let fixedExperienceTwo = training_experience.split('@');

    fixedExperienceTwo.forEach(expe => {

        let li = document.createElement('li');
        li.classList.add('prac-experience-element');
        li.innerHTML = `
            ${expe}
        `

        practical_experience_list.appendChild(li);
    })
}


showFeedback();

async function showFeedback () {
    
    let res = await fetch(`http://localhost:3000/api/feedback/${doctor_id}`);

    let data = await res.json();

    // let { first_name, last_name, practical_experience, img, training_experience } = data[0];

    data.forEach(info => {

        let li = document.createElement('li');
        li.classList.add('feedbacks');
        li.innerHTML = `
            <p class="feedback-name"> ${info.first_name_patient} ${info.last_name_patient} </p>
            <p class="feedback-content"> ${info.feedback_content} </p>
        
        `

        feedback_list.appendChild(li);


    })

}

showHospitalInfo();


async function showHospitalInfo () {

    let res = await fetch(`http://localhost:3000/api/hospitalfromdoctor/${doctor_id}`);

    let data = await res.json();

    let { hospitalname, location } = data[0];

    hospital_name.innerText = hospitalname;
    
    hospital_address.innerText = location;

}


