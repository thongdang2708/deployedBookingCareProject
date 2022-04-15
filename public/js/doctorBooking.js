let input = document.getElementById('place-input');
let booking_list = document.querySelector('.booking-value');
let button = document.getElementById('button');
let placeholder = document.getElementById('placeholder');
let form_control = document.querySelector('.form-control');
let booking_value = document.querySelector('.booking-value');
console.log(doctor_id);
// Button Event Listener
button.addEventListener('click', (et) => {
    et.preventDefault();

    button.parentNode.classList.toggle('active');
    placeholder.classList.toggle('active');

})

let arrayrong = [];
let arrayrongTwo = [];
let arrayrongThree = [];
//Update current dates
fetchTime();

function fetchTime () {

    let newDate = new Date();

    let year = newDate.getFullYear();
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let date = newDate.toLocaleDateString('en-us', {'weekday' : 'long'});
    newDate.setDate(newDate.getDate() + 1);
    let nextday = newDate.getDate();
    let nextmonth = newDate.getMonth() + 1;
    let nextyear = newDate.getFullYear();
    let nextDate = newDate.toLocaleDateString('en-us', {'weekday' : 'long'});
    if (date != 'Sunday') {
        input.value =  date + ' ' + day + '/' + month + '/' + year;
    } else if (date == 'Sunday') {
        input.value =  nextDate + ' ' + nextday + '/' + nextmonth + '/' + nextyear;
    }

    // input.value = date + ' ' + day + '/' + month;

    for (let i=0; i<=2; i++) {
        let newDate = new Date();
        newDate.setDate(newDate.getDate() + i);
        let day = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let date = newDate.toLocaleDateString('en-us', {'weekday' : 'long'});

        if (date != 'Sunday') {
       
        let li = document.createElement('li');
        li.classList.add('booking-date');
        li.innerHTML = `
        <div class='icon'>
        <i class="fa-solid fa-square-check"></i>
        </div>

        <div class='date' date=${date} day=${day} month=${month} year=${year}>
            <strong>  ${date} ${day}/${month}/${year}        </strong>
        </div>
        `
        placeholder.appendChild(li);
    } 
    }

    setWidthForPlaceholder();
    clickButtonForEachDate();
    clickToChangeDate();
    setBookingValues();
   
}



//Set Booking Values;
function setBookingValues () {
    arrayrong = [];
    for (let i=9; i<=17;i+=0.25) {
      
        let integerNumbers = i.toString().split('.')[0];

        let decimalNumbers = i - Math.floor(i);
       
        let stringNumbers = '';
        if (decimalNumbers === 0) {
            stringNumbers += integerNumbers + ':' + '00'
        } else {
            stringNumbers += integerNumbers + ':' + (decimalNumbers*60);
        } 
        
    
       arrayrong.push(stringNumbers);
        
    }
    console.log(arrayrong);
    arrayrongTwo = [];
    for (let j=0; j<=arrayrong.length;j++) {
        let emptyArray = arrayrong.slice(j,j+2);

        arrayrongTwo.push(emptyArray);
    }

    arrayrongTwo.splice(-2,1);
    arrayrongTwo.splice(-1,1);

    

    addHoursToBookingValues();

}

//Add hour boxes to booking-value placeholder

function addHoursToBookingValues () {

    console.log(input.value);

    let date = Number(input.value.split(' ')[1].split('/')[0]);
    let month = Number(input.value.split(' ')[1].split('/')[1]);
    let year = Number(input.value.split(' ')[1].split('/')[2]);
    let weekday = input.value.split(' ')[0];
    console.log(weekday);
    booking_value.innerHTML = '';
    arrayrongTwo.forEach(data => {
      
        let start_time = data[0];

        let end_time = data[1];

        let a = document.createElement('a');
        a.classList.add('button-click-date');
        a.href = `/form/?${doctor_id}|${weekday}|${date}|${month}|${year}|${start_time}|${end_time}`;
        a.setAttribute('date',date);
        a.setAttribute('month',month);
        a.setAttribute('start_time',start_time);
        a.setAttribute('end_time',end_time);
        a.setAttribute('year',year);

        let button = document.createElement('button');
        button.classList.add('button');
        button.classList.add('animated-btn');
        button.innerText =  `${data[0]} - ${data[1]}`;
        a.appendChild(button);
        //a.innerText = `${data[0]} - ${data[1]}`;
        booking_value.appendChild(a);
    })
    // let res = await fetch('list.json');
    // let data = await res.json();

    // let start_times = data.map(info => info.start_time);
    // let end_times = data.map(info => info.end_time);
    
    // arrayrongThree = [];
    // start_times.forEach((start,index) => {
    //     end_times.forEach((end,indexTwo) => {
    //         if (index === indexTwo){
    //             arrayrongThree.push([start,end]);
    //         }
    //     })
    // })
    
    checkBookedHours();
  
}

setInterval(animatedButton,7500);
function animatedButton () {
    let allButtons = document.querySelectorAll('.animated-btn');


    allButtons.forEach(button => button.classList.remove('animated-btn'),
    );
    
}



async function checkBookedHours () {
    let allBookingDates = document.querySelectorAll('.button-click-date');

    let res = await fetch(`http://localhost:3000/api/doctor/${doctor_id}`);
    let data = await res.json();
    let mappedData = data.map(info => ({
        date: info.date,
        month:  info.month,
        year: info.year,
        start_time: info.start_time,
        end_time: info.end_time
    }))

    console.log(mappedData);
    console.log(data);
    allBookingDates.forEach(bookingdate => {
        
        let year = bookingdate.getAttribute('year');
        let date = bookingdate.getAttribute('date');
        let month = bookingdate.getAttribute('month');
        let start_time = bookingdate.getAttribute('start_time').length < 5 ? '0' + bookingdate.getAttribute('start_time') : bookingdate.getAttribute('start_time');
        let end_time = bookingdate.getAttribute('end_time').length < 5 ? '0' + bookingdate.getAttribute('end_time') : bookingdate.getAttribute('end_time');
        
        if (mappedData.some(info => info.date.toString() == date.toString() & info.month.toString() == month.toString() & info.year.toString() == year.toString() & info.start_time.toString() == start_time.toString() & info.end_time.toString() == end_time.toString())) {
        //    bookingdate.classList.add('red');
                bookingdate.querySelector('.button').disabled = true;
                bookingdate.querySelector('.button').classList.add('red');
        } 


    })
    blockPost();

}

function blockPost () {
    let allBlocks = document.querySelectorAll('#block-post');

   allBlocks.forEach(block => {
       block.setAttribute('disabled',true);
       console.log(block);
   })
}

//Set height for Placeholder Box

function setWidthForPlaceholder () {

   let allBookingDates = placeholder.querySelectorAll('.booking-date');

    if (allBookingDates.length < 3) {
        placeholder.style.height = '6rem';
    } else if (allBookingDates.length >= 3){
        placeholder.style.height = '9rem';
       
    }
}


//Click to change each date
function clickButtonForEachDate() {

    let allDatesInList = document.querySelectorAll('.booking-date');

    allDatesInList.forEach(date => {
        
       let dateEl = date.querySelector('.date').innerText.trim();

       if (dateEl != input.value.trim()) {
           date.classList.add('active');
       } 
        
    })
    
}


//Click to change date
function clickToChangeDate () {
    
    let bookingDates = document.querySelectorAll('.booking-date');
   
  

    bookingDates.forEach(bookingdate => {
        

        bookingdate.addEventListener('click', (et) => {
            
            
            bookingDates.forEach(bookingDateTwo => {
                if (bookingDateTwo.className.includes('active') === false) {
                    bookingDateTwo.classList.add('active');
                }
            })

            input.value = '';
            et.preventDefault();
           

            placeholder.classList.remove('active');
            form_control.classList.remove('active');
            let date = bookingdate.querySelector('.date').getAttribute('date');
            let day = bookingdate.querySelector('.date').getAttribute('day');
            let month = bookingdate.querySelector('.date').getAttribute('month');
            let year = bookingdate.querySelector('.date').getAttribute('year');
            
            input.value = date + ' ' + day + '/' + month + '/' + year;
            
            if (bookingdate.querySelector('.date').innerText.trim() == input.value.trim()) {
                bookingdate.classList.remove('active');
            } else if (bookingdate.querySelector('.date').innerText.trim() != input.value.trim()) {
                bookingdate.classList.add('active');
            } 

            setBookingValues();
        })
    })

}


