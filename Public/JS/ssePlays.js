if(IS_LIVE){ //obtained form navigation
    const playsSource = new EventSource(`/sse/plays/${gameId}`);
    playsSource.onmessage = (event) => {
        const data = JSON.parse(event.data);    

        let newPlays = [];
        for(let i = prevPlays.length; i < data.length;i++){
            newPlays.push(data[i]);
        }
        newPlays.forEach(playText => {
            const newPlayElement = document.createElement('p');
            newPlayElement.textContent = playText;
            playsContainer.appendChild(newPlayElement); //from match.ejs
            playsContainer.scrollTop = playsContainer.scrollHeight;
        });
        prevPlays = data;
    };
  }else{
    console.log('not plays');
  }