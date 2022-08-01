'use strict'

// This is the same as: window.onload = onInit
$(onInit)


function onInit() {

    addEventListeners()
    renderVendors()
    renderCars()
    renderFilterByQueryStringParams()
}

function addEventListeners() {
    $('.btn-add').on('click', onAddCar)
    $('.btn-close').on('click', onCloseModal)
    $('.btn-next').on('click', onNextPage)
    $('.sort-by').on('change', onSetSortBy)
    $('.sort-desc').on('change', onSetSortBy)

    $('.filter-vendor-select').on('change', function(ev){
        console.log('Event', ev)
        // console.log('the this is the element that fired the event', this)
        onSetFilterBy({vendor: this.value})
    })
    $('.filter-speed-range').on('change', function(){
        // console.log('the this is the element that fired the event', this)
        onSetFilterBy({minSpeed: this.value})
    })    
}

function renderVendors() {
    const vendors = getVendors()
    const strHTMLs = vendors.map(vendor => `<option>${vendor}</option>`)

    strHTMLs.unshift('<option value="">Select Vendor</option>')
    // const elVendors = document.querySelector('.filter-vendor-select')
    const $elVendors = $('.filter-vendor-select')
    $elVendors.html(strHTMLs)
    
    // elVendors.innerHTML = strHTMLs.join('')
}

function renderCars() {
    var cars = getCars()
    var strHtmls = cars.map(car => `
        <article class="car-preview" data-id="${car.id}">
            <button class="btn-remove">X</button>
            <h5>${car.vendor}</h5>
            <h6>Up to <span>${car.maxSpeed}</span> KMH</h6>
            <button class="btn-read">Details</button>
            <button class="btn-update">Update</button>
            <img onerror="this.src='img/fiat.png'" src="img/${car.vendor}.png" alt="Car by ${car.vendor}">
        </article> 
        `
    )
    // document.querySelector('.cars-container').innerHTML = strHtmls.join('')
    $('.cars-container').html(strHtmls)
    
    $('.cars-container').find('.btn-remove').on('click', function(){
        const carId = $(this).closest('article').data('id')
        onDeleteCar(carId)
    })
    $('.cars-container').find('.btn-read').on('click', function(){
        const carId = $(this).closest('article').data('id')
        onReadCar(carId)
    })
    $('.cars-container').find('.btn-update').on('click', function(){
        const carId = $(this).closest('article').data('id')
        onUpdateCar(carId)
    })


}

function onDeleteCar(carId) {
    deleteCar(carId)
    renderCars()
    flashMsg(`Car Deleted`)
}

function onAddCar() {
    var vendor = prompt('vendor?')
    if (vendor) {
        const car = addCar(vendor)
        renderCars()
        flashMsg(`Car Added (id: ${car.id})`)
    }
}

function onUpdateCar(carId) {
    const car = getCarById(carId)
    var newSpeed = +prompt('Speed?', car.maxSpeed)
    if (newSpeed) {
        const car = updateCar(carId, newSpeed)
        renderCars()
        flashMsg(`Speed updated to: ${car.maxSpeed}`)
    }
}

function onReadCar(carId) {
    var car = getCarById(carId)
    var $elModal = $('.modal')
    const $elTitle = $elModal.children('h3')
    $elTitle.text(car.vendor)
    
    const $elSpeed = $elModal.find('h4 span')
    $elSpeed.text(car.maxSpeed)
    
    $elModal.children('p').text(car.desc)
    $elModal.addClass('open')
}

function onSetFilterBy(filterBy) {
    filterBy = setCarFilter(filterBy)
    const queryStringParams = `?vendor=${gFilterBy.vendor}&minSpeed=${gFilterBy.minSpeed}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

    renderCars()
}


function onCloseModal() {
    $('.modal').removeClass('open')
}

function flashMsg(msg) {
    const $el = $('.user-msg')
    $el.text(msg)
    $el.addClass('open')
    setTimeout(() => {
        $el.removeClass('open')
    }, 3000)
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        vendor : queryStringParams.get('vendor') || '',
        minSpeed : queryStringParams.get('minSpeed') || 0
    }

    // document.querySelector('.filter-vendor-select').value = filterBy.vendor
    $('.filter-vendor-select').val(filterBy.vendor)

    // document.querySelector('.filter-speed-range').value = filterBy.minSpeed
    $('.filter-speed-range').val(filterBy.minSpeed)
    setCarFilter(filterBy)
}

function onSetSortBy() {
    // const prop = document.querySelector('.sort-by').value
    const prop = $('.sort-by').val()
    const isDesc = $('.sort-desc').prop('checked')

    const sortBy = {}
    sortBy[prop] = (isDesc)? -1 : 1

    // Shorter Syntax:
    // const sortBy = {
    //     [prop] : (isDesc)? -1 : 1
    // }
    setCarSort(sortBy)
    renderCars()
}


function onNextPage() {
    nextPage()
    renderCars()
}