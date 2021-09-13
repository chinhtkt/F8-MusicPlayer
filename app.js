const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cdThumb = $('.cd-thumb');
const PLAYER_STORAGE_KEY = 'F8_PLAYER'
const repeatBtn =$('.btn-repeat')
const randomBtn = $('.btn-random')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress =$('#progress')
const nextBtn = $('.btn-next');
const prevBtn =$('.btn-prev');
const playList = $('.playlist')

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  
  songs: [
    {
      name: 'Stay',
      singer: 'The Kid LAROI, Justin Bieber',
      path: './assets/music/song1.mp3',
      image: './assets/img/picture1.jpg',
    },
    {
      name: 'ROXANNE',
      singer: 'Arizona Zervas',
      path: './assets/music/song2.mp3',
      image: './assets/img/picture2.jpg',
    },
    {
      name: 'Sunflower',
      singer: 'Post Malone, Swae Lee',
      path: './assets/music/song3.mp3',
      image: './assets/img/picture3.jpg',
    },
    {
      name: ' At My Worst',
      singer: 'Pink Sweat$',
      path: './assets/music/song4.mp3',
      image: './assets/img/picture4.jpg',
    },
    {
      name: 'INDUSTRY BABY',
      singer: 'Lil Nas X, Jack Harlow',
      path: './assets/music/song5.mp3',
      image: './assets/img/picture5.jpg',
    },
  ],
  setConfig: function(key,value){
    this.config[key] = value;
   localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },
  render: function () {
    const htmls = this.songs.map((song,index) => {
      return `
            <div class="song ${index === this.currentIndex ? 'active' : ""}"data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
                </div>
          `;
    });
    $('.playlist').innerHTML = htmls.join('');
  },
  defineProperties: function() {
    Object.defineProperty(this, 'currentSong', {
        get: function() {
            return this.songs[this.currentIndex];
        }
    })
  },

  handleEvents: function () {
    const _this = this
    const cdWidth = cd.offsetWidth;

    //Xu ly CD quay / dung
    const cdThumbAnimate = cdThumb.animate([
        {transform: 'rotate(360deg)'}
    ], {
        duration: 10000, // 10 secs
        iterations: Infinity
    })
    cdThumbAnimate.pause()

    console.log(cdThumbAnimate)
    // Xu ly phong to / thu nho CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    //Xu ly khi click play


    playBtn.onclick = function() {
        if(_this.isPlaying) {
            audio.pause()
        }
        else {
            audio.play()
        }
    }
    // Khi song duoc play
    audio.onplay = function() {
        _this.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play();
    }
    // Khi song bi pause
    audio.onpause = function() {
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause();
    }
    
    //Tien do bai hat thay doi
    audio.ontimeupdate = function() {
        if(audio.duration) {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
        }
    }

    // Xu ly khi tua bai hat
    progress.oninput = function(e) {
        const seekTime = audio.duration * e.target.value / 100
        audio.currentTime = seekTime
    }
    //Event next/prev bai hat


    nextBtn.onclick = function() {
        if(_this.isRandom) {
            _this.playRandomSong()
        } else {
            _this.nextSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()

    }

    prevBtn.onclick = function() {
        if(_this.isRandom) {
            _this.playRandomSong()
        } else {
            _this.prevSong();
        }
        audio.play()
        _this.render()
    }
    // Ramdom bai hat
    
    randomBtn.onclick = function(e) {
        _this.isRandom =!_this.isRandom
        _this.setConfig('isRamdom', _this.isRandom)
        randomBtn.classList.toggle('active', _this.isRandom)
    }

    // Lap lai bai hat


    repeatBtn.onclick = function(e) {
      _this.isRepeat =!_this.isRepeat
      _this.setConfig('isRepeat', _this.isRepeat)
      repeatBtn.classList.toggle('active',_this.isRepeat)
  
    }
    // Tu dong chuyen bai hat moi khi ket thuc
    audio.onended = function () {
      if(_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.onclick();
      }
    }
    
    // Lang nghe khi bam vao playlist se phat nhac

    playList.onclick = function (e) {
      const songElement = e.target.closest('.song:not(.active)') 
      if(songElement || e.target.closest('.option')) {
        if(songElement) {
          _this.currentIndex = Number(songElement.dataset.index)
          _this.loadCurrentSong()
          _this.render();
          audio.play()
        }

        if(e.target.closest('.option')) {
          alert('Work in progress')
        }
      }
    }
  },

  // Thanh keo se tu dong chi den vi tri cua bai hat
  scrollToActiveSong: function() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({behavior: "smooth", block: "end",})
    },300)
  },

  loadCurrentSong: function() {
      const heading = $('header h2')
      const audio = $('#audio')
      heading.textContent = this.currentSong.name
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
      audio.src = this.currentSong.path
  },
  loadConfig: function() {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
  },
  //Khi next bai hat
  nextSong: function() {
    this.currentIndex++
    if(this.currentIndex >= this.songs.length) {
        this.currentIndex = 0
    }
    this.loadCurrentSong();
  },
  //Khi prev bai hat
  prevSong: function() {
    this.currentIndex--
    if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length -1
    }
    this.loadCurrentSong();
  },

  //Khi xu ly  random bai hat
  playRandomSong: function() {
    let newIndex
    do {
        newIndex =  Math.floor(Math.random() * this.songs.length)
    } while(newIndex == this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong();
  },

  start: function () {
    // Gan cau hinh tu config vao object app
    this.loadConfig();
      // Dinh nghia cac thuoc tinh cho object
    this.defineProperties();
      // Lang nghe/ xu ly cac su kien (DOM events)
    this.handleEvents();
      // Tai thong tin bai hat dau tien vao UI khi chay ung dung
    this.loadCurrentSong();
     // Render playlist
    this.render();

    // Hien thi trang thai ban dau
    randomBtn.classList.toggle('active', this.isRandom)
    repeatBtn.classList.toggle('active', this.isRepeat)
  },
};

app.start();
