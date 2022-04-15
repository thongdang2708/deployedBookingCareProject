let hide_price_list = document.getElementById('hide-price-list');

let click_for_insurance_price = document.getElementById('click-for-insurance-price');

let box_detail = document.querySelector('.box-detail-two');

let show_role = document.querySelector('.show-role');

show_role.addEventListener('click', (urf) => {

    urf.preventDefault();
    show_role.parentNode.parentNode.classList.toggle('active')
})

click_for_insurance_price.addEventListener('click', (ed) => {
    ed.preventDefault();

    box_detail.classList.add('active');
    hide_price_list.classList.add('active');
    click_for_insurance_price.classList.add('hidden')
})

hide_price_list.addEventListener('click',(er) => {

    er.preventDefault();

    box_detail.classList.remove('active');
    hide_price_list.classList.remove('active');
    click_for_insurance_price.classList.remove('hidden')
})

