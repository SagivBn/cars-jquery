
function onInit() {
    // const elTitle = document.querySelector('h1')
    // elTitle.innerText = 'Hello JQuery'
    // elTitle.classList.add('highlite')
    
    const $elTitle = $('h1')
    // $elTitle.text('Hello and Shalom JQuery')
    $elTitle.html('Hello and <i>Shalom</i> JQuery')
    $elTitle.addClass('highlite')

    // $elTitle.hide('slow')



}
