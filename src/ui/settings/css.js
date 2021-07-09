export default () => {
  const el = document.createElement('style');

  el.appendChild(document.createTextNode(`
#gm-settings-inject > div, .gm-store-settings {
  display: flex;
  flex-flow: row wrap;

  align-items: center;
  justify-content: center;
}

.gm-store-settings > h1 {
  flex-basis: 100%;
}

.gm-inline-dropdown {
  display: flex;
  align-items: center;

  margin-left: 12px;
}

.gm-inline-dropdown > .select-2TCrqx {
  width: 120px;
  margin-left: 8px;
}

.gm-store-search {
  flex-grow: 1;

  margin-right: 12px;
}

.gm-store-header {
  margin-bottom: 0;

  width: 100%;
  max-width: 100%;
}


.gm-store-card {
  box-shadow: var(--elevation-medium);
  background-color: var(--background-secondary);

  border-radius: 8px;
  box-sizing: border-box;

  padding: 12px;
  margin: 10px;

  width: 330px;
  height: 380px;

  position: relative;
}

.gm-store-card > :nth-child(1) {
  width: calc(100% + 24px);
  height: 200px;

  border-radius: 8px 8px 0 0;

  margin-top: -12px;
  margin-left: -12px;

  background-color: var(--background-secondary-alt);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 50%;

  text-align: center;
  line-height: 200px;

  color: var(--interactive-normal);
  font-family: var(--font-display);
  font-size: 36px;
}

.gm-store-card > :nth-child(2) {
  position: absolute;
  top: 152px;
  right: 10px;

  opacity: 0.95;

  border-radius: 16px;

  background-color: rgba(0, 0, 0, 0.5);
  width: fit-content;

  padding-right: 10px;
}

.gm-store-card > :nth-child(2).no-pfp {
  padding: 4px 8px;
}

.gm-store-card > :nth-child(3) {
  width: 85%;
  margin-top: 10px;

  overflow: hidden;
  display: -webkit-box;
  webkit-line-clamp: 1;
  webkit-box-orient: vertical;
}

.gm-store-card > :nth-child(4) {
  width: 85%;
  margin-top: 5px;

  overflow: hidden;
  display: -webkit-box;
  webkit-line-clamp: 3;
  webkit-box-orient: vertical;

  clear: both;
}

.gm-store-card > :nth-child(5) {
  display: flex;
  align-items: center;
  flex-direction: column;
  order: 2;
  margin-left: auto;
  position: absolute;
  top: 208px;
  right: 12px;
}

.gm-store-card > :nth-child(5) > :nth-child(1) {

}

.gm-store-card > :nth-child(5) > :nth-child(1) > :nth-child(1) {
  position: relative;
  top: 7px;
  font-size: 18px;
  font-weight: 600;
}

.gm-store-card > :nth-child(5) > :nth-child(1) > :nth-child(2) {
  position: relative;
  top: 8px;
  margin-left: 5px;
}

.gm-store-card > :nth-child(5) > :nth-child(2) {
  margin-top: 20px;
}

.gm-store-card > :nth-child(6) {
  position: absolute;
  bottom: 12px;
  width: calc(100% - 32px);
  display: flex;
  gap: 5px;
}

.gm-store-card > :nth-child(6) > :nth-child(1) {
  display: inline-flex;
  cursor: pointer;
  width: 90px;
}

.gm-store-card > :nth-child(6) > :nth-child(2) {
  width: auto;
  margin-left: 14px;
  min-width: 0px;
  padding: 2px 5px;
  color: rgb(221, 221, 221);
  display: inline-flex;
  cursor: pointer;
}

.gm-store-card > :nth-child(6) > :nth-child(3) {
  margin-top: 4px;
  position: absolute;
  right: -10px;
}

.gm-store-card > :nth-child(6) > :nth-child(3).hide-toggle {
  display: none !important;
}


.gm-store-category {
  width: 100%;
}

.gm-store-category > :nth-child(2) {
  display: grid;
  overflow-x: scroll;
  grid-template-columns: repeat(auto-fill, 350px);
  grid-auto-flow: column;
  width: 100%;
}


.gm-store-loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}


.gm-settings-note-markdown {
  font-size: inherit;
  color: inherit !important;
}

.gm-settings-note-markdown .paragraph-3Ejjt0 {
  margin: 0;
}

.gm-settings-label-icon {
  vertical-align: sub;
}

.gm-settings-label-text {
  vertical-align: top;
  margin-left: 6px;
}

.gm-settings-header-collapser {
  margin-top: -3px;
  float: right;
  width: 22px;
  height: 22px;
}

.gm-settings-header-collapser.collapsed {
  transform: rotate(-90deg);
}


/* Store image carousel */
.gm-carousel-modal {
  background-color: var(--background-primary);
  border-radius: 6px;
  padding: 12px;

  pointer-events: all;
}

.gm-carousel-modal .outer-s4sY2_ {
  width: 600px;
  height: 400px;

  padding-top: 0 !important;

  background-color: var(--background-secondary-alt);
}

.gm-carousel-modal .root-3tU4d2 {
  background-color: unset;
}

.gm-carousel-modal .smallCarouselImage-2Qvg9S {
  cursor: default;
}


/* OOTB */
.gm-modules-preview .guildIcon-cyDh6h {
  display: none;
}

.gm-modules-preview .cardHeader-2XrQbx {
  margin-bottom: 12px;
}

.gm-modules-preview .card-3_CqkU {
  background-color: var(--background-tertiary);
}

.gm-ootb-modal {
  width: 600px;
}

.gm-highlight #app-mount::after {
  display: block;
  content: '';

  box-shadow: 0 0 0 99999px rgb(0 0 0 / 50%);
  z-index: 9;
}

.gm-highlight .content-3YMskv [id*="gm"] {
  filter: brightness(2);
  background: var(--background-modifier-selected);

  border-radius: 0;
  z-index: 10;

  transition: all .5s;
}
`));

  document.body.appendChild(el);
}