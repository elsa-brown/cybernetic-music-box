/* issues: playing two streams at once, stopping/controlling duration of notes, how to reverse playback + connect to scroll */

// require dependencies
const Tone = require('tone')
const ScrollMagic = require('scrollmagic')
// const Clip = require('phonograph').Clip

// POEM FOR COMPUTER
const poemText = `I like to think 
(and the sooner the better!) 
of a cybernetic meadow 
where mammals and computers 
live together in mutually 
programming harmony 
like pure water 
touching clear sky. 
I like to think 
(right now, please!) 
of a cybernetic forest 
filled with pines and electronics 
where deer stroll peacefully 
past computers 
as if they were flowers 
with spinning blossoms. 
I like to think 
(it has to be!) 
of a cybernetic ecology 
where we are free of our labors 
and joined back to nature, 
returned to our mammal 
brothers and sisters, 
and all watched over
by machines of loving grace.`

// helper function for converting poem to array of integers btw 20 and 20,000
const textConvert = (text) => text.split('').map(
  (letter, idx) => text.charCodeAt(idx)).map(
    (int) => (int < 35 ? int + 40 : int) * 10
  )

// store array of integers (representing each letter in the poem)
let poemIntegers = textConvert(poemText)
console.log('poemIntegers length is', poemIntegers.length)


// create Tone player node from audio element
let audioSegmentDuration = 0
const audio = document.querySelector('audio')
  audio.autoplay = false
  audio.load()
  audio.addEventListener('loadedmetadata', () => {
    audioSegmentDuration = audio.duration / 596
  })
setTimeout(console.log('segment duration is', audioSegmentDuration), 5000)

let player = new Tone.Player({
  url: './static/Voice.mp3',
  autostart: false,
  retrigger: true,
}).toMaster()

const playerEnv = new Tone.AmplitudeEnvelope({
  attack: 0.10,
  decay: 0.10,
  sustain: 0.01,
  release: 0.002
}).toMaster()

player.connect(playerEnv)

// create 'segment' divs for scroll magic scene implementation 
// 'A' segments for start audio, 'B' segements for pause audio. 596/ea
const layout = () => {
  let height = 0
  while (height < 1192) {
    let segment = document.createElement('div')
    if (height % 2 === 0) {
      segment.style.border = 'solid white'
      segment.style.height = '20px'
      segment.id = `A-segment-${height / 2}`
    } else {
      segment.style.border = 'solid yellow'
      segment.style.height = '0px'
      segment.id = `B-segment-${(height - 1) / 2}`
    }
    document.getElementById('segments')
      .appendChild(segment)
    height++
  }
  console.log('layout complete', (height - 1))
}

// call layout function
layout()

// SCROLL MAGIC
// create controller object
let controller = new ScrollMagic.Controller()
//const segmentDuration = audio.duration / 596

// store ids from every segment div
let segmentIds = Array.from(document.getElementById('segments').children).map((child) => {return child.id})

// create envelope for tone instrument (to be created)
const env = new Tone.AmplitudeEnvelope({
  attack: 0.01,
  decay: 0.05,
  sustain: 0.01,
  release: 0.002
}).toMaster();

// index of poem array && segment' number id
let idx = 0
// create a scroll scene for each segment div
const createScrollScenes = () => {
  // index of poem array && segment number id
  let idx = 0
  segmentIds.forEach((id) => {
    //console.log('id is', id)
    //console.log('triggerElem is', id)
    // 'A' segments to start audio
    if (id[0] === 'A') {
      let freq = poemIntegers[idx]
      //create an oscillator and connect it to the envelope
      let osc = new Tone.Oscillator({
      partials: [],
      type: 'sine',
      frequency: freq,
      volume: -8,
      }).connect(env).start()

      new ScrollMagic.Scene({
        triggerElement: `#${id}`,
        duration: 100
      })
      .addTo(controller)
      // set callback for on div enter
      .on('enter', (e) => {
        console.log('segment id is', id, 'offset is', idx)
        // get scroll direction and set player direction accordingly
        let direction = e.target.controller().info('scrollDirection')
          direction === 'REVERSE' ? 
            player.reverse = true :
            player.reverse = false
          console.log('direction is', direction,
            'player.reverse is', player.reverse)
          // player.start(start)
          playerEnv.triggerAttackRelease()
          idx++
      })
    // 'B' segments to stop audio
    } else if (id[0] === 'B') {
      // new ScrollMagic.Scene({
      //   triggerElement: `#${id}`,
      //   duration: 0
      // })
      // .addTo(controller)
      // .on('enter', (e) => {
      //   player.stop()
      //})
      null
    }
  })
}

// call function to create Scroll Magic scenes
createScrollScenes()


// // Tone testing

// store HTML5 audio element
// *** 0.084 seconds *** split 50 sec. voice audio into samples this length
// const audio = document.querySelector('audio')
// const player = new Tone.Player('./static/Voice.mp3').toMaster()
// let buffer = new Tone.Buffer('./static/Voice.mp3', () =>

// )

// Clip
// let button = document.getElementById('play')
// let clip = new Clip('./static/Voice.mp3').clone()
// button.onClick = () => {
//   clip.buffer()
//     .then(() => clip.play())
//     .catch((err) => console.error(err))
// //let playing = false
// }


// Tone Audio stuff'
// index of poem array
/*let idx = 0
document.addEventListener('scroll', () => {
  // set integer from 'poemIntegers' to frequency value
  let freq = poemIntegers[idx] 
  //console.log('freq is', freq, 'at', idx)

  // create envelope
  const env = new Tone.AmplitudeEnvelope({
    attack: 0.01,
    decay: 0.05,
    sustain: 0.01,
    release: 0.002
  }).toMaster();

  //create an oscillator and connect it to the envelope
  let osc = new Tone.Oscillator({
    partials: [],
    type: 'sine',
    frequency: freq,
    volume: -8,
  }).connect(env).start();

  env.triggerAttackRelease()

  if (idx === poemIntegers.length - 1) console.log('THE END!')
  // increment the index, or set back to 0 if at the end
  idx === poemIntegers.length ? idx = 0 : idx++


  // VOICE INPUT
  // HTML5 audio element
  // let buffer = new Tone.Buffer('./static/Voice.mp3', () => {
  //   !scrolling ? buffer.start() : buffer.stop()
  // })

  // // reset scrolling variable
  // scrolling = !scrolling
})
*/

// FIRST PASS TONE.JS IMPLEMENTATION
// // Play Button
// let button = document.getElementById('play')

// //set idx at 0, to be incremented over 'poemIntegers'
// let idx = 0
// button.onclick = () => {
// 	console.log('freq is', poemIntegers[idx])
//   // set integer from 'poemIntegers' to frequency value
// 	let freq = poemIntegers[idx]

//   // new oscillator set to current frequency value
// 	let osc = new Tone.Oscillator(freq).toMaster().start()
//   Tone.Transport.schedule((time) => {osc.stop()}, 1)

//   // increment the index, or set back to 0 if at the end
// 	idx === poemIntegers.length ? idx = 0 : idx++
// }
//END FIRST PASS TONE.JS IMPLEMENTATION

// // let playing = false
// // let idx = 0
// // while (idx <= poemIntegers.length) {
// // 	button.onclick = () => {
// // 		!playing ? play(poemIntegers[idx]) : stop()
// // 		playing = !playing
// // 		idx++
// // 	}
// // }

// // Web Audio API Testing

// // const context = new window.AudioContext

// // let source

// // const stop = () =>  source ? source.stop() : null

// // const play = () => {
// // 	source = context.createOscillator()
// // 	source.type = 'square'
// // 	source.frequency = 400

// // 	let gain = context.createGain()
// // 	gain.gain.value = -40

// // 	source.connect(gain)
// // 	gain.connect(context.destination)

// // 	source.start()
// // }

// // let button = document.getElementById('play')

// // let playing = false
// // button.onclick = () => {
// // 	!playing ? play() : stop()
// // 	playing = !playing
// // }

// // CONVERT COLORS TO NOISE

// // Get Colors API

// // const Vibrant = require('node-vibrant')

// // Vibrant.from('https://upload.wikimedia.org/wikipedia/commons/b/b7/White-tailed_deer.jpg').getPalette((err, palette) => {
// // 	err ? console.error(err) : null
// // 	console.log('palette is', palette)


// /*
// // Clarifai image recognition
// const Clarifai = require('clarifai')

// const app = new Clarifai.App(
// 	'GIPTo1lbvCnocLh2zKDffYfgFAIxxrK8S85WyfiS',
// 	'UdtwH4jNJwyzuRZpqEzZ-Gc7zjyblHdkR8Yj7VFw'
// )

// // get number values as hex numbers

// //let colors = []
// let colors = app.models.predict('eeed0b6733a644cea07cf4c60f87ebb7', 'https://samples.clarifai.com/metro-north.jpg')
// 	.then((response) => {
// 		console.log('colors array from promise is', response.outputs[0].data.colors)
//     return response.outputs[0].data.colors
//   })
//   .done()

// console.log('colors is', colors)
// */

//VOICE AUDIO - HTML5 element - SCROLL WORKING
//let audio = document.querySelector('audio')


//let prevScrollTop = 0;

// let scrolling = false;
// document.addEventListener('scroll', () => {
//   //audio.playbackRate = -1
//   !scrolling ? audio.play() : audio.pause()
//   scrolling = !scrolling
// })

// document.addEventListener('mouseup', () =>
//   scrolling ? audio.pause() : null
// )

// let playing = false
// button.onclick = () => {
//  !playing ? audio.play() : audio.pause()
//  playing = !playing
// }

// VOICE AUDIO - Web Audio API
// const context = new window.AudioContext()

// let source

// const stop = () => (source ? source.stop() : null)

// const play = () => {
//  const audio = document.querySelector('audio')
//  source = context.createMediaElementSource(audio)
//   console.log('source is', source);
//   source.connect(context.destination)
//  source.start()
// }

// let button = document.getElementById('play')

// let playing = false
// button.onclick = () => {
//  !playing ? play() : stop()
//  playing = !playing
// }

// VOICE AUDIO - Tone.js - BUTTON
// const Tone = require('tone')

// const player = new Tone.Player('./static/Meadow.mp3').toMaster()

// let button = document.getElementById('play')

// let playing = false
// button.onclick = () => {
//   !playing ? player.start() : player.pause()
//   playing = !playing
// }

// maybe some scroll thing
// const images = [
// './static/deer1.jpg',
// './static/deer2.jpg',
// './static/deer3.jpg'
// ]

// const preCacheImages = () => {
//   images.forEach((image) => {
//    new Image().src = image
//  })
// }

// window.onload = preCacheImages()

// ABANDONDED SCROLL + HMTL5 AUDIO CODE
// .on('update', (e) => {
//   let direction = e.target.controller().info('scrollDirection')
//   console.log(e.target.controller().info('scrollDirection'))
//   // set playback rate based on scroll direction
//   audio.play()
// })
/* .on('enter', (e) => {
  let direction = e.target.controller().info('scrollDirection')
  console.log(direction)
   direction === 'FORWARD' ? audio.playbackRate = 1 : audio.playbackRate = -1
  console.log('playbackRate is', audio.playbackRate)
  audio.play()
})
.on('leave', () => audio.pause())
.on('enter leave', (e) => e.type === "enter" ? 
    console.log("enter") : 
    console.log("outside")
)
.on('progress', () => {
  console.log('current time is', audio.curentTime)
})

// .on('progress', (e) => {
//   let time = audio.currentTime
//   console.log('current time is', time)
//   let direction = e.target.controller().info('scrollDirection')
//   audio.play()
//   direction === 'FORWARD' ? audio.playbackRate = 1 : audio.playbackRate = -1
//   console.log('playbackRate is', audio.playbackRate)
//   if (audio.currentTime === (time + segmentDuration)) {
//     console.log('current time is', audio.currentTime)
//     audio.pause() 
//   }
// !scrolling ? audio.play() : audio.pause()
// scrolling = !scrolling */

// ABANDONED jQUERY IMPLEMENTATION
// jQuery / plain JS scroll implementation for VOICE
//const audio = document.querySelector('audio')

// $(document).ready(() => {

//   const progress = () => {
//     console.log('audio is', audio)
//     let duration = audio.duration
//     console.log('duration is', duration)
//     console.log('currentTime is', audio.currentTime)
//     let $w = $(window),
//     scrollable = $(document).height() - $w.height()
//   let scrollRatio =
//     $(document).scrollTop() / scrollable
//       if ( isNaN(scrollRatio) ) scrollRatio = 0
//       audio.currentTime = scrollRatio * duration
//   }

//   $(window).on('scroll', progress).load(progress())

// })

