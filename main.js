const departmentsUrl = "https://collectionapi.metmuseum.org/public/collection/v1/departments";
const galleriesUrl = "https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=";
const pieceUrl = "https://collectionapi.metmuseum.org/public/collection/v1/objects/"
let galleryId;
let departments;
let list =[];
let index = 0;
document.querySelector('button').addEventListener('click', getDepartments);

async function getDepartments(){
    document.querySelector('button').hidden = true;
    document.querySelector('h1').innerText = "Select a Department";
    document.querySelector('body').style.backgroundImage = "url(images/museumHallway.jpeg)";
    
    const response = await fetch(departmentsUrl);
    const data = await response.json(); 

    data.departments.forEach( department => {
        const square = document.createElement('a');
        square.className = 'department';
        square.setAttribute('id', department.departmentId);
        square.innerText = department.displayName;
        document.querySelector('section').append(square);
    });
    Array.from(document.querySelectorAll('.department')).forEach(dep => dep.addEventListener('click', getGallery));
}


async function getGallery(){
    galleryId = this.id;
    
    if(document.querySelectorAll('.department')!==null){
        document.querySelectorAll('.department').forEach(e => e.remove());
    }

    document.querySelector('h1').innerText = this.innerText;
    document.querySelector('body').style.background = 'radial-gradient(#DFD7BA 65%,#8A713D)';

    const response = await fetch(galleriesUrl + galleryId);
    list = await response.json();
    getPiece(list);
}

function getPiece(list){
    let objectId = list.objectIDs[index];
    document.querySelector('.left').hidden = false;
    document.querySelector('.right').hidden = false;

    fetch(pieceUrl + objectId)
        .then((res)=>res.json())
        .then((data)=>{
            const piece = document.createElement('article');
            piece.className = 'piece';
            piece.setAttribute('id', objectId);
            document.querySelector('section').append(piece);

            const frame = document.createElement('div');
            frame.className = 'frame';
            piece.append(frame);
            
            const image = document.createElement('img');
            frame.append(image);

            const description = document.createElement('div');
            description.className = 'description';
            piece.append(description);
            image.src = data.primaryImage;
            description.innerText = `${data.title}\n${data.objectDate}\n${data.culture}`
            
            
        })
        .catch((e)=> console.log(e));
}
document.querySelector('.right').addEventListener('click', getNextRight);
document.querySelector('.left').addEventListener('click', getNextLeft); 

function getNextLeft(){
    index = (index===0)? list.total-1 : index-1;
    updatePiece(list);
}

function getNextRight(){
    index =  (index===list.total-1)? 0 : index+1;
    updatePiece(list);
}

function updatePiece(){
    let objectId = list.objectIDs[index];

    fetch(pieceUrl + objectId)
    .then((res)=>res.json())
    .then((data)=>{
        
        document.querySelector('.frame img').src = data.primaryImage;
        document.querySelector('.description').innerText = `${data.title}\n${data.objectDate}\n${data.culture}`
        
        
    })
    .catch((e)=> console.log(e));
} 