;(() => {
	'use strict'
	if (window.UI_LISTENERS) return
	window.UI_LISTENERS = true
	const camelcase = (s) => s.replace(/-./g, (x) => x[1].toUpperCase())
	const ATTR_ITEM = '[data-ui-item]'
	const ATTR_TARGET = '[data-ui-target]'
	const ATTR_CLEARABLE = '[data-ui-clearable]'
	const NAME_ACTIVENESS = 'active'
	const NAME_SHOWED = 'show'
	const NAME_TRANSITION = 'ing'
	let WINDOW_SCROLLABLE = true
	/* UI_LISTENERS ************************************************************ */
	const UI_LISTENERS = {
		touchmove(e) {
			if (!WINDOW_SCROLLABLE && e.cancelable) e.preventDefault()
		},
		click(e) {
			const caller = e.target.closest('[data-ui-click]')
			if (caller) {
				const action = camelcase(caller.dataset.uiClick)
				if (typeof UI_ACTIONS[action] === 'function') {
					UI_ACTIONS[action](e, caller)
				}
			}
		},
		pointerdown(e) {
			const caller = e.target.closest('[data-ui-pointerdown]')
			if (caller) {
				const action = camelcase(caller.dataset.uiPointerdown)
				if (typeof UI_ACTIONS[action] === 'function') {
					UI_ACTIONS[action](e, caller)
				}
			}
			/* data-ui-clearable */
			const clearableItems = document.querySelectorAll(`${ATTR_ITEM}${ATTR_CLEARABLE}.${NAME_ACTIVENESS}`)
			for (const item of clearableItems) {
				if (!item.contains(e.target)) {
					closeDropdown([item])
				}
			}
		},
		wheel(e) {
			const caller = e.target.closest('[data-ui-wheel]')
			if (caller) {
				const action = camelcase(caller.dataset.uiWheel)
				if (typeof UI_ACTIONS[action] === 'function') {
					UI_ACTIONS[action](e, caller)
				}
			}
		},
		resizeTimeout: null,
		resize() {
			if (!this.resizeTimeout) {
				this.resizeTimeout = setTimeout(
					function () {
						this.resizeTimeout = null
						const sliders = document.querySelectorAll('[data-ui-pointerdown = slider-move]')
						sliders.forEach((slider) => {
							if (slider.classList.contains('reviews'))
								slider.set_UI_Slider({
									view: window.innerWidth >= 1024 ? 3 : window.innerWidth >= 744 ? 2 : 1,
									between: window.innerWidth >= 1440 ? 32 : 24,
									pagination: true,
								})
							if (!slider.inited) {
								if (!initSlider(slider)) return
								slider.inited = true
							}
							slider.gestureStart = null
							sweepSlider(slider, slider.startP, 0)
							if (slider.timeout) {
								clearTimeout(slider.timeout)
								slider.timeout = setTimeout(slider.timeoutFunction, slider.options.delay)
							}
						})
						const body = document.querySelector('body.nav-opened')
						if (body && window.innerWidth > 1024) body.classList.remove('nav-opened')
						// for Safari Bug Fix (animation + resized) ----
						const rollers = document.querySelectorAll('[data-ui-pointerdown = animation-wind]')
						rollers.forEach((roller) => {
							const animation = roller.children[0].getAnimations({ subtree: false })[0]
							if (animation) animation.currentTime = 0
						})
						// ---- for Safari Bug Fix
					}.bind(this),
					100,
				)
			}
		},
		scrollTimeout: null,
		scroll() {
			if (!this.scrollTimeout) {
				this.scrollTimeout = setTimeout(
					function () {
						this.scrollTimeout = null
						const checkers = document.querySelectorAll('.sticky-checker')
						checkers.forEach((checker) => {
							if (!checker.observer) {
								const observer = new IntersectionObserver(
									([e]) => e.target.classList.toggle('is-pinned', e.intersectionRatio < 1),
									{ threshold: [1] },
								)
								observer.observe(checker)
								checker.observer = true
							}
						})
						if (!document.body.classList.contains('main')) {
							const quick = document.querySelector('.quick-util')
							if (quick) quick.classList.toggle('active', window.scrollY > 0)
						}
					}.bind(this),
					100,
				)
			}
		},
	}
	window.addEventListener('touchmove', UI_LISTENERS.touchmove, {
		passive: false,
	})
	window.addEventListener('click', UI_LISTENERS.click)
	window.addEventListener('pointerdown', UI_LISTENERS.pointerdown)
	window.addEventListener('wheel', UI_LISTENERS.wheel, {
		passive: false,
	})
	window.addEventListener('resize', UI_LISTENERS.resize.bind(UI_LISTENERS))
	window.addEventListener('scroll', UI_LISTENERS.scroll.bind(UI_LISTENERS))
	window.addEventListener('keydown', function (e) {
		if (document.body.classList.contains('main') && e.code === 'Tab') e.preventDefault()
	})
	/* UI_ACTIONS ************************************************************ */
	const UI_ACTIONS = {
		navToggle(e) {
			document.body.classList.toggle('nav-opened')
			e.preventDefault()
		},
		inputClear(e) {
			const input = e.target.previousElementSibling
			input.value = null
			input.focus()
			e.preventDefault()
		},
		scrollTop(e) {
			if (document.body.classList.contains('main')) {
				const sections = document.querySelector('.sections-wrapper')
				scrollSections(sections, 0, true)
			} else {
				window.scrollTo({
					top: 0,
					behavior: 'smooth',
				})
			}
			e.preventDefault()
		},
		dropdownToggle(e, caller) {
			if (!caller.item) caller.item = caller.closest(ATTR_ITEM)
			if (!caller.item) return
			if (!caller.item.inited) {
				if (!initDropdown(caller.item)) return
			}
			const classList = caller.item.classList
			classList.toggle(NAME_ACTIVENESS)
			classList.remove(NAME_SHOWED)
			classList.add(NAME_TRANSITION)
			if (classList.contains(NAME_ACTIVENESS)) {
				openDropdown(caller.item)
				if (caller.dataset.uiSingle === undefined)
					closeDropdown(
						[].filter.call(
							caller.item.parentElement.children,
							(el) =>
								el !== caller.item &&
								el.dataset.uiItem !== undefined &&
								el.classList.contains(NAME_ACTIVENESS),
						),
					)
			} else {
				closeDropdown([caller.item])
			}
			e.preventDefault()
		},
		dropdownClose(e, caller) {
			const id = caller.dataset.uiTarget
			if (!document.querySelector(`#${id}`)) return
			const items = document.querySelector(`#${id}`).querySelectorAll(ATTR_ITEM)
			closeDropdown([].filter.call(items, (el) => el.classList.contains(NAME_ACTIVENESS)))
			e.preventDefault()
		},
		sliderMove(e, caller) {
			if (caller.ing) {
				e.preventDefault()
				return
			}
			if (!caller.inited) {
				if (!initSlider(caller)) return
			}
			WINDOW_SCROLLABLE = false
			caller.stateDown = true
			caller.gestureStart = new Date() // for detecting a flick
			caller.startTX = caller.currentTX
			caller.startSX = e.screenX
			caller.startSY = e.screenY
			caller.movementX = 0
			caller.movementY = 0
			if (caller.timeout) clearTimeout(caller.timeout)
			if (!caller.pointerevent) {
				caller.pointerevent = true
				caller.addEventListener('pointermove', function (e) {
					if (caller.stateDown) {
						caller.movementX = e.screenX - caller.startSX
						caller.movementY = e.screenY - caller.startSY
						if (Math.abs(caller.movementX) + Math.abs(caller.movementY) > 0) {
							if (
								!caller.stateActive &&
								// Math.abs(e.movementX) <= Math.abs(e.movementY)
								Math.abs(caller.movementX) <= Math.abs(caller.movementY)
							) {
								const event = new PointerEvent('pointerup')
								caller.dispatchEvent(event)
							} else {
								caller.stateActive = true
								caller.target.style.transitionDuration = '0s'
								// caller.currentTX += e.movementX;
								caller.currentTX += caller.movementX
								caller.startSX = e.screenX
								caller.target.style.transform = `translateX(${caller.currentTX}px)`
								caller.target.style.pointerEvents = 'none'
							}
						}
					}
				})
				caller.addEventListener('pointerup', function (e) {
					if (caller.stateDown) {
						WINDOW_SCROLLABLE = true
						caller.stateDown = false
						caller.target.style.transitionDuration = ''
						caller.gestureEnd = new Date() // for detecting a flick
						if (caller.stateActive) {
							caller.stateActive = false
							sweepSlider(caller, caller.currentP())
						} else {
							// console.log(`scroll..`);
						}
						if (caller.timeout) {
							clearTimeout(caller.timeout)
							caller.timeout = setTimeout(caller.timeoutFunction, caller.options.delay)
						}
						caller.target.style.pointerEvents = ''
					}
				})
				caller.addEventListener('pointerleave', function (e) {
					const event = new PointerEvent('pointerup')
					caller.dispatchEvent(event)
				})
			}
			e.preventDefault()
		},
		sliderPrev(e) {
			const slider = e.target.closest('[data-ui-pointerdown = slider-move]')
			if (!slider || slider.ing) {
				return
			}
			if (!slider.inited) {
				if (!initSlider(slider)) return
			}
			if (!slider.options.infinite && slider.currentP() === 0) return
			sweepSlider(slider, slider.currentP() === 0 ? slider.pages - 1 : slider.currentP() - 1)
			e.preventDefault()
		},
		sliderNext(e) {
			const slider = e.target.closest('[data-ui-pointerdown = slider-move]')
			if (!slider || slider.ing) {
				return
			}
			if (!slider.inited) {
				if (!initSlider(slider)) return
			}
			if (!slider.options.infinite && slider.currentP() === slider.pages - 1) return
			sweepSlider(slider, slider.currentP() === slider.pages - 1 ? 0 : slider.currentP() + 1)
			e.preventDefault()
		},
		animationWind(e, caller) {
			if (!caller.target) caller.target = caller.children[0]
			if (!caller.target) return
			if (!caller.animation) caller.animation = caller.target.getAnimations({ subtree: false })[0]
			if (!caller.animation) return
			caller.windDirection = caller.dataset.uiWindMovement || 'left'
			caller.windSpeed = getComputedStyle(caller).getPropertyValue('--wind-speed') || 20
			caller.target.style.animationPlayState = 'paused'
			WINDOW_SCROLLABLE = false
			caller.stateDown = true
			caller.startSX = e.screenX
			caller.startSY = e.screenY
			caller.movementX = 0
			caller.movementY = 0
			if (!caller.pointerevent) {
				caller.pointerevent = true
				caller.addEventListener('pointermove', function (e) {
					if (caller.stateDown) {
						caller.movementX = e.screenX - caller.startSX
						caller.movementY = e.screenY - caller.startSY
						if (Math.abs(caller.movementX) + Math.abs(caller.movementY) > 0) {
							if (!caller.stateActive && Math.abs(caller.movementX) <= Math.abs(caller.movementY)) {
								const event = new PointerEvent('pointerup')
								caller.dispatchEvent(event)
							} else {
								caller.stateActive = true
								caller.animation.currentTime = Math.max(
									0,
									caller.windDirection === 'left'
										? caller.animation.currentTime - caller.movementX * caller.windSpeed
										: caller.animation.currentTime + caller.movementX * caller.windSpeed,
								)
								caller.startSX = e.screenX
								caller.target.style.pointerEvents = 'none'
							}
						}
					}
				})
				caller.addEventListener('pointerup', function (e) {
					if (caller.stateDown) {
						WINDOW_SCROLLABLE = true
						caller.stateDown = false
						if (caller.stateActive) caller.stateActive = false
						caller.target.style.pointerEvents = ''
						caller.target.style.animationPlayState = ''
					}
				})
				caller.addEventListener('pointerleave', function (e) {
					const event = new PointerEvent('pointerup')
					caller.dispatchEvent(event)
				})
			}
			e.preventDefault()
		},
		sectionsScroll(e, caller) {
			if (caller.ing) {
				if (e.cancelable) e.preventDefault()
				return
			}
			if (!caller.inited) {
				caller.container = caller.closest('.container')
				caller.target = caller.children[0]
				if (!caller.target || !caller.container) return
				caller.sectionLength = caller.target.children.length
				if (!caller.sectionLength) return
				// for Scroll Section ----
				caller.overSection = caller.target.querySelector(':scope > .scroll')
				caller.overSectionIndex = Array.prototype.indexOf.call(caller.target.children, caller.overSection)
				if (caller.overSection) {
					caller.overSection.addEventListener(
						'touchstart',
						function (e) {
							caller.overSection.startSY = e.touches[0].clientY
						},
						{
							passive: false,
						},
					)
					caller.overSection.addEventListener(
						'touchmove',
						function (e) {
							if (WINDOW_SCROLLABLE) {
								if (Number(caller.dataset.uiCurrent) === caller.overSectionIndex) {
									if (
										caller.overSection.scrollTop <= 0 &&
										caller.overSection.startSY - e.touches[0].clientY < 0
									) {
										scrollSections(caller, caller.overSectionIndex - 1)
										if (e.cancelable) e.preventDefault()
									} else if (
										Math.ceil(caller.overSection.scrollTop) >=
											caller.overSection.scrollHeight - caller.overSection.offsetHeight &&
										caller.overSection.startSY - e.touches[0].clientY > 0
									) {
										scrollSections(caller, caller.overSectionIndex + 1)
										if (e.cancelable) e.preventDefault()
									}
								} else if (Number(caller.dataset.uiCurrent) === caller.sectionLength) {
									scrollSections(caller, caller.sectionLength - 1)
									if (e.cancelable) e.preventDefault()
								}
							}
						},
						{
							passive: false,
						},
					)
					caller.overSection.addEventListener(
						'wheel',
						function (e) {
							if (Number(caller.dataset.uiCurrent) === caller.overSectionIndex) {
								if (caller.overSection.scrollTop <= 0 && e.deltaY < 0) {
									scrollSections(caller, caller.overSectionIndex - 1)
									if (e.cancelable) e.preventDefault()
								} else if (
									Math.ceil(caller.overSection.scrollTop) >=
										caller.overSection.scrollHeight - caller.overSection.offsetHeight &&
									e.deltaY > 0
								) {
									scrollSections(caller, caller.overSectionIndex + 1)
									if (e.cancelable) e.preventDefault()
								}
							}
						},
						{
							passive: false,
						},
					)
				}
				// ---- for Scroll Section
				caller.inited = true
			}
			// for Scroll Section ----
			if (
				Number(caller.dataset.uiCurrent) === caller.overSectionIndex &&
				caller.overSection.scrollHeight > caller.overSection.offsetHeight
			)
				return
			// ---- for Scroll Section

			if (e.type === 'pointerdown') {
				caller.startSection = Number(getComputedStyle(caller).getPropertyValue('--current'))
				WINDOW_SCROLLABLE = false
				caller.stateDown = true
				caller.gestureStart = new Date() // for detecting a flick
				caller.movementMin = 80 // window.innerHeight / 3;
				caller.startSX = e.screenX
				caller.startSY = e.screenY
				caller.movementX = 0
				caller.movementY = 0
				if (!caller.pointerevent) {
					caller.pointerevent = true
					caller.addEventListener('pointermove', function (e) {
						if (caller.stateDown) {
							caller.movementX = e.screenX - caller.startSX
							caller.movementY = e.screenY - caller.startSY
							scrollSections(
								caller,
								caller.startSection - Math.trunc(caller.movementY / caller.movementMin),
							)
							// caller.target.style.pointerEvents = "none";
						}
					})
					caller.addEventListener('pointerup', function (e) {
						if (caller.stateDown) {
							WINDOW_SCROLLABLE = true
							caller.stateDown = false
							caller.gestureEnd = new Date() // for detecting a flick
							if (
								Math.abs(caller.movementY) > Math.abs(caller.movementX) &&
								caller.startSection ===
									Number(getComputedStyle(caller).getPropertyValue('--current')) &&
								caller.gestureEnd - caller.gestureStart < 200
							) {
								scrollSections(
									caller,
									caller.movementY < 0 ? caller.startSection + 1 : caller.startSection - 1,
								)
								// console.log(`flick..`);
							}
							// caller.target.style.pointerEvents = "";
						}
					})
					caller.addEventListener('pointerleave', function (e) {
						const event = new PointerEvent('pointerup')
						caller.dispatchEvent(event)
					})
				}
				e.preventDefault()
			} else if (e.type === 'wheel') {
				if (!caller.setDeltaY) {
					caller.setDeltaY = (deltaY) => {
						clearTimeout(caller.wheelTimeout)
						caller.wheelTimeout = setTimeout(function () {
							caller.startSection = Number(getComputedStyle(caller).getPropertyValue('--current'))
							scrollSections(caller, deltaY > 0 ? caller.startSection + 1 : caller.startSection - 1)
						}, 100)
					}
				}
				caller.setDeltaY(e.deltaY)
			}
		},
	}
	/* Sections ************************************************************ */
	function scrollSections(sections, page, forced) {
		if (!sections.inited) return
		const current = Math.min(sections.sectionLength, Math.max(0, page))
		if (forced && sections.overSection) {
			sections.overSection.scrollTo({
				top: 0,
				behavior: 'smooth',
			})
		}
		if (Number(sections.dataset.uiCurrent) !== current && !sections.ing) {
			sections.ing = true
			WINDOW_SCROLLABLE = false
			const event = new PointerEvent('pointerup')
			sections.dispatchEvent(event)
			const ingTarget =
				current === sections.sectionLength
					? sections.container
					: sections.target.children[sections.dataset.uiCurrent]
			if (ingTarget) {
				ingTarget.addEventListener(
					'transitionend',
					function () {
						sections.ing = false
						WINDOW_SCROLLABLE = true
					},
					{ once: true },
				)
			} else {
				sections.ing = false
				WINDOW_SCROLLABLE = true
			}
			sections.style.setProperty('--current', current)
			sections.dataset.uiCurrent = current
			sections.container.dataset.uiCurrent = current
		}
	}
	/* Dropdown ************************************************************ */
	function initDropdown(item) {
		if (!item.target) item.target = item.querySelector(ATTR_TARGET)
		if (!item.target) return
		item.inited = true
		if (!item.target.position) item.target.position = getComputedStyle(item.target).getPropertyValue('position')
		if (!item.transitionend) {
			const classList = item.classList
			item.transitionend = () => {
				if (classList.contains(NAME_ACTIVENESS)) {
					classList.add(NAME_SHOWED)
				} else {
					classList.remove(NAME_SHOWED)
					item.target.classList.remove('left', 'right', 'top', 'bottom')
				}
				classList.remove(NAME_TRANSITION)
				item.target.style.height = ''
			}
		}
		return true
	}
	function openDropdown(item) {
		const target = item.target
		const height = findHeight(target)
		if (target.position === 'absolute') {
			const offset = item.getBoundingClientRect()
			target.classList.add(
				offset.left < window.innerWidth / 2 ? 'left' : 'right',
				offset.top < window.innerHeight / 2 ? 'top' : 'bottom',
			)
		}
		target.addEventListener('transitionend', item.transitionend, {
			once: true,
		})
		setTimeout(function () {
			target.style.height = height + 'px'
		}, 0)
	}
	function closeDropdown(items) {
		const length = items.length
		items.forEach((item) => {
			if (!item.inited) {
				if (!initDropdown(item)) return
			}
			const classList = item.classList
			classList.remove(NAME_ACTIVENESS)
			classList.remove(NAME_SHOWED)
			if (length > 100) return // no transition
			classList.add(NAME_TRANSITION)
			const target = item.target
			const height = findHeight(target)
			target.style.height = height + 'px'
			target.addEventListener('transitionend', item.transitionend, {
				once: true,
			})
			setTimeout(function () {
				target.style.height = ''
			}, 0)
		})
	}
	function findHeight(target) {
		// target.style.display = getComputedStyle(target).getPropertyValue("display");
		target.style.height = 'auto'
		const height = target.offsetHeight
		// target.style.display = "";
		target.style.height = ''
		return height
	}
	/* Slider ************************************************************ */
	function initSlider(slider, options) {
		if (!slider) return
		if (!slider.target) slider.target = slider.querySelector('.items')
		if (!slider.target) return
		/* items */
		if (slider.removalItems) {
			for (const item of slider.removalItems) item.remove()
			slider.removalItems = null
		}
		slider.items = [].slice.call(slider.target.children)
		if (!slider.items.length) return
		slider.inited = true
		/* options */
		slider.options = {
			autoplay: false,
			delay: 3000,
			view: 1,
			between: 0,
			infinite: false,
			pagination: false,
			navigation: false,
		}
		if (options) Object.assign(slider.options, options)
		/* infinite */
		if (slider.items.length <= slider.options.view) slider.options.infinite = false
		if (slider.options.infinite) {
			slider.removalItems = []
			// add blank
			const restNum = slider.items.length % slider.options.view
			if (restNum) {
				const num = slider.options.view - restNum
				const blankItems = []
				for (let i = 0; i < num; i++) {
					const blank = document.createElement('div')
					blank.classList.add('item', 'blank')
					blank.style.visibility = 'hidden'
					blankItems.push(blank)
				}
				slider.removalItems.push(...blankItems)
				slider.target.append(...blankItems)
				slider.items.push(...blankItems)
			}
			// add clone
			const frontClones = []
			const endClones = []
			for (let i = 1; i <= slider.options.view; i++) {
				const front = slider.items[i - 1].cloneNode(true)
				front.classList.add('clone')
				front.style.pointerEvents = 'none'
				frontClones.push(front)
				const end = slider.items[slider.items.length - i].cloneNode(true)
				end.classList.add('clone')
				end.style.pointerEvents = 'none'
				endClones.unshift(end)
			}
			slider.removalItems.push(...frontClones, ...endClones)
			slider.target.append(...frontClones)
			slider.items.push(...frontClones)
			slider.target.prepend(...endClones)
			slider.items.unshift(...endClones)
		}
		/* item.style */
		slider.items.forEach((item) => {
			item.style.width = `calc((100% - ${slider.options.between * (slider.options.view - 1)}px) / ${
				slider.options.view
			})`
			item.style.marginRight = `${slider.options.between}px`
		})
		/* transitionstart & transitionend */
		if (!slider.target.transitionstart) {
			slider.target.transitionstart = true
			slider.target.addEventListener('transitionstart', function () {
				slider.ing = true
			})
		}
		if (!slider.target.transitionend)
			slider.target.transitionend = () => {
				slider.currentTX = new DOMMatrix(slider.target.style.transform).m41
				if (slider.timeout) {
					clearTimeout(slider.timeout)
					slider.timeout = setTimeout(slider.timeoutFunction, slider.options.delay)
				}
				slider.ing = false
				slider.gestureStart = null
				if (slider.options.infinite) {
					if (slider.startP === 0 || slider.startP === slider.pages - 1) {
						const page = slider.startP === 0 ? slider.pages - 2 : 1
						sweepSlider(slider, page, 0)
						// console.log(`rewind..`);
					}
				}
				if (slider.prevEl)
					slider.prevEl.classList.toggle('disabled', !slider.options.infinite && slider.currentP() === 0)
				if (slider.nextEl)
					slider.nextEl.classList.toggle(
						'disabled',
						!slider.options.infinite && slider.currentP() === slider.pages - 1,
					)
				// console.log(`transitionend.. ${slider.currentTX}`);
			}
		/* pagination */
		slider.pages = Math.ceil(slider.items.length / slider.options.view)
		// if (slider.pages < 2) return;
		if (slider.pagination) slider.pagination.remove()
		if (slider.options.pagination) {
			slider.pagination = document.createElement('div')
			slider.pagination.classList.add('pagination')
			slider.pagination.items = []
			const num = slider.options.infinite ? slider.pages - 2 : slider.pages
			for (let i = 0; i < num; i++) {
				const item = document.createElement('i')
				slider.pagination.append(item)
				slider.pagination.items.push(item)
			}
			slider.append(slider.pagination)
		}
		slider.currentTX = new DOMMatrix(slider.target.style.transform).m41
		if (!slider.currentP)
			slider.currentP = () =>
				Math.min(
					slider.pages - 1,
					Math.max(
						0,
						Math.round(
							-slider.currentTX / (slider.querySelector('.wrapper').offsetWidth + slider.options.between),
						),
					),
				)
		if (!slider.startP) slider.startP = slider.currentP()
		if (slider.options.infinite) {
			sweepSlider(slider, 1, 0)
		} else {
			sweepSlider(slider, 0, 0)
		}
		/* navigation */
		slider.prevEl = slider.querySelector('[data-ui-click = slider-prev]')
		slider.nextEl = slider.querySelector('[data-ui-click = slider-next]')
		if (slider.prevEl)
			slider.prevEl.classList.toggle('disabled', !slider.options.infinite && slider.currentP() === 0)
		if (slider.nextEl)
			slider.nextEl.classList.toggle(
				'disabled',
				!slider.options.infinite && slider.currentP() === slider.pages - 1,
			)
		/* autoplay */
		if (slider.timeout) {
			clearTimeout(slider.timeout)
			slider.timeout = null
		}
		if (slider.options.autoplay) {
			autoSlider(slider)
		}
		return true
	}
	function autoSlider(slider) {
		if (!slider.timeoutFunction) {
			slider.timeoutFunction = () => {
				slider.target.style.transitionDuration = ''
				sweepSlider(slider, slider.currentP() === slider.pages - 1 ? 0 : slider.currentP() + 1)
			}
		}
		slider.timeout = setTimeout(slider.timeoutFunction, slider.options.delay)
	}
	function sweepSlider(slider, page, duration) {
		if (page === slider.startP && slider.gestureEnd - slider.gestureStart < 200) {
			if (page > 0 && slider.currentTX - slider.startTX >= 1) {
				page--
			} else if (page < slider.pages - 1 && slider.currentTX - slider.startTX <= -1) {
				page++
			}
		}
		slider.startP = page
		/* pagination */
		if (slider.options.pagination) {
			const validItem =
				slider.pagination.items[
					slider.options.infinite
						? page === slider.pages - 1
							? 0
							: page === 0
							? slider.pages - 3
							: page - 1
						: page
				]
			for (const item of slider.pagination.items) {
				if (item === validItem) {
					item.classList.add(NAME_ACTIVENESS)
				} else {
					item.classList.remove(NAME_ACTIVENESS)
				}
			}
		}
		/* translate */
		if (typeof duration === 'number') {
			slider.target.style.transitionDuration = `${duration}s`
		}
		slider.target.addEventListener('transitionend', slider.target.transitionend, { once: true })
		slider.target.style.transform = `translateX(${
			slider.querySelector('.wrapper').offsetWidth * -page - slider.options.between * page
		}px)`
		if (duration === 0) {
			const event = new PointerEvent('transitionend')
			slider.target.dispatchEvent(event)
		}
		// console.log(`sweep..`);
	}
	/* Add prototype ************************************************************ */
	HTMLElement.prototype.set_UI_Slider = function (opt) {
		initSlider(this, opt)
	}
	HTMLDialogElement.prototype.closeDelay = 300
	HTMLDialogElement.prototype.smoothShowModal = function () {
		this.showModal()
		document.body.classList.toggle('modal-opened', document.body.querySelector('dialog:modal'))
	}
	HTMLDialogElement.prototype.smoothClose = function (returnValue) {
		this.setAttribute('closing', '')
		setTimeout(
			function () {
				this.removeAttribute('closing')
				this.close(returnValue)
				document.body.classList.toggle('modal-opened', document.body.querySelector('dialog:modal'))
			}.bind(this),
			this.closeDelay,
		)
	}
})()
