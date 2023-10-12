if(IS_LIVE){ //obtained form navigation
  console.log('live');
  const eventSource = new EventSource("/sse/matches");
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);  
    for (let i= 0;i < data.length; i++) {
      const game = data[i];
      
      const homeScore = document.getElementById(`home-score-${game.id}`);
      const awayScore = document.getElementById(`away-score-${game.id}`);
      const clock = document.getElementById(`clock-${game.id}`);
      const period = document.getElementById(`period-${game.id}`);
      homeScore.classList.add('flash');
      awayScore.classList.add('flash');
      clock.classList.add('flash');
      period.classList.add('flash');
      homeScore.textContent = game.homeScore;
      awayScore.textContent = game.awayScore;
      clock.textContent = game.status.displayClock;
      period.textContent = game.status.period;

      setTimeout(()=>{
          homeScore.classList.remove('flash');
          awayScore.classList.remove('flash');
          clock.classList.remove('flash');
          period.classList.remove('flash');
      },2000);
    }
    
    prevData = data;
  };
}else{
  console.log('not live');
}