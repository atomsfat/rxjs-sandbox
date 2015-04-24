$(document).ready ->

  refreshButton = document.querySelector('.refresh')
  refreshClickStream = Rx.Observable.fromEvent(refreshButton, "click") 

  requestStream = refreshClickStream.map (e)->
    console.log e
    randomOffset = Math.floor(Math.random()*500)
    "https://api.github.com/users?since=#{randomOffset}"
  .merge Rx.Observable.just('https://api.github.com/users')

  
  # requestStream = Rx.Observable.just("https://api.github.com/users?since=#{randomOffset}")
  console.log requestStream

  reponseStream = requestStream.flatMap (requestUrl)->
    Rx.Observable.fromPromise($.getJSON(requestUrl))
 

  list1 = reponseStream.map (users)->
    users[Math.floor(Math.random()*users.length)]  
  .merge refreshClickStream.map () ->  null 


  list1.subscribe (response)->
    console.log "response", response 
