gsap.registerPlugin(ScrollTrigger);

smoothScroll(".body-wrapper", ".viewport", 1.2)


//mobile optimization code

function refresher() {
  ScrollTrigger.refresh()
  isDesktop()
  circleHeight()
}

var prevWidth = window.innerWidth;
var refresherTimeout;

window.addEventListener("resize", function () {
  if (prevWidth != window.innerWidth) {
    prevWidth = window.innerWidth
    clearTimeout(refresherTimeout)
    refresherTimeout = setTimeout(refresher, 200)
  }
})

function isDesktop() {
  const windowWidth = window.innerWidth
  if (windowWidth > 880) {
    return true
  }

  if (windowWidth <= 880) {
    return false
  }
}

//header card tilt

const moneyCards = document.querySelectorAll(".money-card")

document.addEventListener("mousemove", (e) => {
  tiltCard(e, moneyCards[0])
})

function tiltCard(event, element) {
  const offsetY = -(window.innerWidth / 2 - event.clientX) / 50
  const offsetX = (window.innerHeight / 2 - event.clientY) / 30

  moneyCards.forEach((card) => {
    card.style.setProperty("--rotateX", offsetX + "deg")
    card.style.setProperty("--rotateY", offsetY + "deg")
  })

}

//nav movement

const floatingBackground = document.querySelector(".floating-background")

floatingBackground.addEventListener("mousemove", (e)=>{
  moveCard(e, floatingBackground)
})

const elasticNav = function () {
  const elasticSnap = gsap.to(floatingBackground, { translateX: 0, translateY: 0, duration: 1, ease: Elastic.easeOut })
  setTimeout(() => {
    elasticSnap.kill()
  }, 1000)
}

floatingBackground.addEventListener("mouseleave", elasticNav)

gsap.fromTo(floatingBackground, {scale: 0}, {scale: 1, duration: 1, delay: 0.8, ease: "elastic.out(1,0.5)"})



const menuOpen = gsap.timeline({paused: true})
menuOpen.to(".menu-container", {yPercent: 99, duration: 0.7, ease: "power3.out"})
.to(".menu-overlay", {y: "0", duration: 0.01}, "<")
.to(".menu-overlay", {opacity: 1, duration: 0.7}, "<")
.to(".nav-circle", {height: circleHeight()/*this function is below*/, duration: 0.7}, "<")
.to(".floating-icon", {yPercent: -100, duration: 0.6, ease: "power3.out"}, "<")
.to(".floating-x", {yPercent: -100, duration: 0.6, ease: "power3.out"}, "<+=0.4")

let x = 0;
const html = document.querySelector("html")

floatingBackground.addEventListener("click", openMenu)

function openMenu () {
  x++
  if ((x - 1) % 2 == 0) { //open
    menuOpen.play()
    html.classList.add("fixed-position")
  }
  if (x % 2 == 0) { //closed
    menuOpen.reverse()
    html.classList.remove("fixed-position")
  }
}

const overlay = document.querySelector(".menu-overlay")

overlay.addEventListener("click", ()=>{
  menuOpen.reverse()
  html.classList.remove("fixed-position")
})

//features card movement

const featureCards = document.querySelectorAll(".card")
const featureCardsDesktop = gsap.matchMedia()
let elasticAnim;

featureCardsDesktop.add("(min-width: 880px)", () => {
  featureCards.forEach((card, index) => {
    card.addEventListener("mousemove", (e) => {
      moveCard(e, featureCards[index])
    })

    elasticAnim = function () {
      const elasticSnap = gsap.to(featureCards[index], { translateX: 0, translateY: 0, duration: 1, ease: Elastic.easeOut })
      setTimeout(() => {
        elasticSnap.kill()
      }, 1000)
    }

    card.addEventListener("mouseleave", elasticAnim)
  })
})

featureCardsDesktop.add("(max-width: 879px)", () => {
  featureCards.forEach((card) => {
    card.removeEventListener("mouseleave", elasticAnim)
  })
  gsap.set(".col1", {yPercent: 15})
  gsap.set(".col2", {yPercent: -15})
  gsap.to(".col1", {
    scrollTrigger: {
      trigger: ".features",
      start: "top 70%",
      end: "bottom 40%",
      scrub: 1.5,
      //markers: true
    }, yPercent: 0, ease: "linear"
  })
  
  gsap.to(".col2", {
    scrollTrigger: {
      trigger: ".features",
      start: "top 70%",
      end: "bottom 40%",
      scrub: 1.5,
      //markers: true
    }, yPercent: 0, ease: "linear"
  })
  
})


function moveCard(event, element) {
  const x = event.clientX - element.getBoundingClientRect().x
  const y = event.clientY - element.getBoundingClientRect().y

  const middleX = element.offsetWidth / 2
  const middleY = element.offsetHeight / 2

  const offsetX = ((x - middleX) / middleX) * 30;
  const offsetY = ((y - middleY) / middleY) * 30;

  if (isDesktop()) {
    gsap.to(element, { x: offsetX, y: offsetY, duration: 0.5 })
  }
}


//bobbing rectangles

const movingCards = gsap.timeline({
  scrollTrigger: {
    trigger: ".scrollingTrigger",
    start: "top 50%",
    end: "bottom 50%",
    scrub: 1.5,
  }
})

movingCards.to(".moving-rect1", { yPercent: -60 })
  .to(".moving-rect2", { yPercent: 35 }, "<")


//footer circle

function circleHeight() {
  if (isDesktop()) {
    return 150
  } else {
    return 80
  }
}

gsap.to(".footer-circle", {
  scrollTrigger: {
    trigger: ".cta-section",
    start: "top 50%",
    end: "center 50%",
    scrub: 1.6,
    //markers: true,
  },
  height: circleHeight() ,
  ease: "linear"
})

// Smooth scrolling

function smoothScroll(content, viewport, smoothness) {
  content = gsap.utils.toArray(content)[0];
  smoothness = smoothness || 1;

  gsap.set(viewport || content.parentNode, { overflow: "hidden", position: "fixed", height: "100%", width: "100%", top: 0, left: 0, right: 0, bottom: 0 });
  gsap.set(content, { overflow: "visible", width: "100%" });

  let getProp = gsap.getProperty(content),
    setProp = gsap.quickSetter(content, "y", "px"),
    setScroll = ScrollTrigger.getScrollFunc(window),
    removeScroll = () => content.style.overflow = "visible",
    killScrub = trigger => {
      let scrub = trigger.getTween ? trigger.getTween() : gsap.getTweensOf(trigger.animation)[0]; // getTween() was added in 3.6.2
      scrub && scrub.pause();
      trigger.animation.progress(trigger.progress);
    },
    height, isProxyScrolling;

  function refreshHeight() {
    height = content.clientHeight;
    content.style.overflow = "visible"
    document.body.style.height = height + "px";
    return height - document.documentElement.clientHeight;
  }

  ScrollTrigger.addEventListener("refresh", () => {
    removeScroll();
    requestAnimationFrame(removeScroll);
  })
  ScrollTrigger.defaults({ scroller: content });
  //ScrollTrigger.prototype.update = p => p; // works around an issue in ScrollTrigger 3.6.1 and earlier (fixed in 3.6.2, so this line could be deleted if you're using 3.6.2 or later)

  ScrollTrigger.scrollerProxy(content, {
    scrollTop(value) {
      if (arguments.length) {
        isProxyScrolling = true; // otherwise, if snapping was applied (or anything that attempted to SET the scroll proxy's scroll position), we'd set the scroll here which would then (on the next tick) update the content tween/ScrollTrigger which would try to smoothly animate to that new value, thus the scrub tween would impede the progress. So we use this flag to respond accordingly in the ScrollTrigger's onUpdate and effectively force the scrub to its end immediately.
        setProp(-value);
        setScroll(value);
        return;
      }
      return -getProp("y");
    },
    scrollHeight: () => document.body.scrollHeight,
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    }
  });

  return ScrollTrigger.create({
    animation: gsap.fromTo(content, { y: 0 }, {
      y: () => document.documentElement.clientHeight - height,
      ease: "none",
      onUpdate: ScrollTrigger.update
    }),
    scroller: window,
    invalidateOnRefresh: true,
    start: 0,
    end: refreshHeight,
    refreshPriority: -999,
    scrub: smoothness,
    onUpdate: self => {
      if (isProxyScrolling) {
        killScrub(self);
        isProxyScrolling = false;
      }
    },
    onRefresh: killScrub // when the screen resizes, we just want the animation to immediately go to the appropriate spot rather than animating there, so basically kill the scrub.
  });
}