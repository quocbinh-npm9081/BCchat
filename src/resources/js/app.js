//chat view scroll 
const el = document.getElementById('messages')
    //el.scrollTop = el.scrollHeight


//upload avata  /profile/edit
const avata = document.querySelector('#photo');
const file = document.querySelector('#file');
const chooseBtn = document.querySelector('#chooseBtn');


file.addEventListener('change', function() {
    const chooseFile = this.files[0];
    //console.log(chooseFile);
    if (chooseFile) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            avata.setAttribute('src', this.result);
        });
        reader.readAsDataURL(chooseFile);
    }
})