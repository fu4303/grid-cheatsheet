import { createElement } from './helpers';

export class Nav {
  constructor ({
    groups,
    targetElem
  }) {
    this.groups = groups;
    this.current = null;

    const navMarkup = this.getNavMarkup();

    this.navElem = createElement(`<nav class="nav">${navMarkup}</nav>`);
    this.markerElem = createElement('<span class="nav__marker"></span>');

    targetElem.prepend(this.navElem);
    this.navElem.prepend(this.markerElem);

    const firstNavItem = this.navElem.querySelector('.nav__item');

    this.setCurrentItem(firstNavItem);

    this.navElem.addEventListener('click', (ev) => {
      const navItem = ev.target.closest('.nav__item');

      if (!navItem) {
        return;
      }
      this.setCurrentItem(navItem);
    });
  }

  getNavMarkup () {
    const itemsList = Object.entries(this.groups)
      .map(([id, { title, items }]) => {
        let markup = '';

        if (title) {
          markup += `<h2 class="nav__subheader">
            <a
              class="nav__subheader-link"
              href="#group-${id}"
              >${title}</a>
          </h2>`;
        }

        markup += this.getListMarkup(items);

        return markup;
      });

    return itemsList.join('');
  }

  getListMarkup (items, customClass = '') {
    const itemsList = items.map(({ alias, name, children }) => {
      const itemClass = 'nav__item';
      let itemsMarkup = '';
      const id = alias || name;

      if (children) {
        itemsMarkup = this.getListMarkup(children, 'nav__list--inner');
      }

      return `<li
          class="${itemClass}"
          data-name="section-${id}"
        ><a
            href="#section-${id}"
            class="nav__link"
          >${name}</a>${itemsMarkup}</li>`;
    });

    return `<ul class="nav__list ${customClass}">${itemsList.join('')}</ul>`;
  }

  setCurrentItem (elem) {
    if (this.currentElem) {
      this.currentElem.classList.remove('nav__item--current');
    }

    this.markerElem.style.top = `${elem.offsetTop}px`;

    elem.classList.add('nav__item--current');

    this.currentElem = elem;
  }
}
