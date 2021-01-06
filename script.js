const cinemacontainer = document.querySelector('.cinema-container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');
const dateSelect = document.getElementById('dtb_yr');

let movieList = [];
var dataToStore = [];

getMovieList();
checkStorage();



function checkStorage() {

    const movieIndex = +localStorage.getItem('selectedMovieIndex');

    if (!(movieIndex === 0)) {
        if (localStorage.getItem('selectedSeats_'+movieList[movieIndex][1]) === null) {
            resetSeatGrid();
            localStorage.setItem('selectedSeats_'+movieList[movieIndex][1], '');
            localStorage.setItem('selectedPremiumSeats_'+movieList[movieIndex][1], '');
            localStorage.setItem('occupiedSeats_'+movieList[movieIndex][1], '');
            
        }
        else {
            resetSeatGrid();
            populateUI();
            updateSelectedCountAndTotal();
        }
    }
    else if (movieIndex === 0) {
        resetSeatGrid();
        document.getElementById('screen').innerHTML = '';
    }
    
}


function getMovieList() {
    for(i=0;i<movieSelect.options.length;i++) {
        movieList.push([movieSelect.options[i].text, movieSelect.options[i].id]);
    }
}


function setMovieData(movieIndex, moviePrice) {
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
   
}


function populateUI() {

    if (localStorage.length > 0) {

        const movieIndex = localStorage.getItem('selectedMovieIndex');

        if (movieIndex !== null) {
            movieSelect.selectedIndex = movieIndex;
        }

        if (!(localStorage.getItem('selectedSeats_'+movieList[movieIndex][1]) === null) || localStorage.getItem('selectedSeats_'+movieList[movieIndex][1]).length > 0) {

            const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats_'+movieList[movieIndex][1]));

            if (selectedSeats !== null && selectedSeats.length > 0) {
                seats.forEach((seat, index) => {
                    if(selectedSeats.indexOf(index) > -1) {
                        seat.classList.add('selected');
                    }
                });
            }
        }

        if (!(localStorage.getItem('selectedPremiumSeats_'+movieList[movieIndex][1]) === null) || localStorage.getItem('selectedPremiumSeats_'+movieList[movieIndex][1]).length > 0) {
            
            const selectedPremiumSeats = JSON.parse(localStorage.getItem('selectedPremiumSeats_'+movieList[movieIndex][1]));

            if (selectedPremiumSeats !== null && selectedPremiumSeats.length > 0) {
                seats.forEach((seat, index) => {
                    if(selectedPremiumSeats.indexOf(index) > -1) {
                        seat.classList.add('selected-premium');
                    }
                });
            }
        }

        if (!(localStorage.getItem('occupiedSeats_'+movieList[movieIndex][1]) === null) || localStorage.getItem('occupiedSeats_'+movieList[movieIndex][1]).length > 0) {
            
            const occupiedSeats = JSON.parse(localStorage.getItem('occupiedSeats_'+movieList[movieIndex][1]));
            
            if (occupiedSeats !== null && occupiedSeats.length > 0) {
                seats.forEach((seat, index) => {
                    if(occupiedSeats.indexOf(index) > -1) {
                        seat.classList.add('occupied');
                    }
                });
            }
        }
    }
};


function updateSelectedCountAndTotal() {

    if (localStorage.length > 0) {

        const selectedSeats = document.querySelectorAll('.row .seat.selected');
        const selectedSeatsPremium = document.querySelectorAll('.row .seat.selected-premium');
        const occupiedSeats = document.querySelectorAll('.row .seat.occupied');

        
        const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));
        const seatsPremiumIndex = [...selectedSeatsPremium].map((seat) => [...seats].indexOf(seat));
        const occupiedIndex = [...occupiedSeats].map((seat) => [...seats].indexOf(seat));

        const movieIndex = localStorage.getItem('selectedMovieIndex');

        localStorage.setItem('selectedSeats_'+movieList[movieIndex][1], JSON.stringify(seatsIndex));
        localStorage.setItem('selectedPremiumSeats_'+movieList[movieIndex][1], JSON.stringify(seatsPremiumIndex));
        localStorage.setItem('occupiedSeats_'+movieList[movieIndex][1], JSON.stringify(occupiedIndex));

        const selectedSeatsCount = selectedSeats.length;
        const selectedPremiumSeatsCount = selectedSeatsPremium.length;

        count.innerText = selectedSeatsCount;
        countpremium.innerText = selectedPremiumSeatsCount;

        const moviePrice = +localStorage.getItem('selectedMoviePrice');
        price.innerText = "£" + moviePrice.toFixed(2);
        premiumprice.innerText = "£" + (moviePrice * 1.25).toFixed(2);

        total.innerText = "£" + (+(selectedSeatsCount * moviePrice + moviePrice * 1.25 * selectedPremiumSeatsCount)).toFixed(2);

        if (!(movieIndex == 0)) {
            document.getElementById('screen').innerHTML = movieList[movieIndex][0];
        }

    }

};



movieSelect.addEventListener('change', (e) => {

    setMovieData(e.target.selectedIndex, e.target.value);
    checkStorage();
    
    ticketPrice = +e.target.value;

    updateSelectedCountAndTotal();
});

$('#dtb_yr').change(function(){
    resetSelection()


    updateSelectedCountAndTotal()
    
    
});

  

cinemacontainer.addEventListener('click', (e) => {

    if(e.target.classList.contains('seat') && !e.target.classList.contains('occupied') && !e.target.classList.contains('premium-seat') && !(movieSelect.options[movieSelect.selectedIndex].id === 'selection')) {
       
        e.target.classList.toggle('selected');
        updateSelectedCountAndTotal();
    }

    if(e.target.classList.contains('premium-seat') && !e.target.classList.contains('occupied') && !(movieSelect.options[movieSelect.selectedIndex].id === 'selection')) {
        e.target.classList.toggle('selected-premium');
        updateSelectedCountAndTotal();
    }

});


document.getElementById('resetselection').addEventListener('click', function() {
    resetSelection();
    updateSelectedCountAndTotal();
});


document.getElementById('confirmselection').addEventListener('click', function() {
    confirmSelection();
    updateSelectedCountAndTotal();
});




function resetSelection() {
    seats.forEach(seat => {
        if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
        }
        if (seat.classList.contains('selected-premium')) {
            seat.classList.remove('selected-premium');
        }
    });
};

function resetSeatGrid() {
    resetSelection();
    seats.forEach(seat => {
        if (seat.classList.contains('occupied')) {
            seat.classList.remove('occupied');
        }
    });
};

function confirmSelection() {
    seats.forEach(seat => {
        if (seat.classList.contains('selected')) {
            seat.classList.add('occupied');
            seat.classList.remove('selected');
        }
        if (seat.classList.contains('selected-premium')) {
            seat.classList.add('occupied');
            seat.classList.remove('selected-premium');
        }
    });
};
