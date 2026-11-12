import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import craftBeerImage from '../assets/carft-beer.jpg';
import cocktailsImage from '../assets/cocktails.jpg';
import brunchImage from '../assets/bruch.jpg';
import beveragesImage from '../assets/webite (5).jpg';

const fallbackMenuData = [
  {
    id: 'craft-beer',
    image: craftBeerImage,
    name: 'Craft Beer',
    items: [
      {
        id: 'old-fashioned',
        name: 'Old Fashioned',
        price: '$9.00',
        description: 'Bourbon, bitters, sugar, and a twist of orange.',
      },
      {
        id: 'margarita',
        name: 'Margarita',
        price: '$8.00',
        description:
          'Fresh lime juice, tequila, and triple sec, served with a salt rim.',
      },
      {
        id: 'moscow-mule',
        name: 'Moscow Mule',
        price: '$9.00',
        description: 'Ginger beer, vodka, and lime juice, served in a copper mug.',
      },
    ],
  },
  {
    id: 'cocktails',
    image: cocktailsImage,
    name: 'Cocktails',
    items: [
      {
        id: 'cocktail-old-fashioned',
        name: 'Old Fashioned',
        price: '$9.00',
        description: 'Bourbon, bitters, sugar, and a twist of orange.',
      },
      {
        id: 'cocktail-margarita',
        name: 'Margarita',
        price: '$8.00',
        description:
          'Fresh lime juice, tequila, and triple sec, served with a salt rim.',
      },
      {
        id: 'cocktail-moscow-mule',
        name: 'Moscow Mule',
        price: '$9.00',
        description: 'Ginger beer, vodka, and lime juice, served in a copper mug.',
      },
    ],
  },
  {
    id: 'brunch',
    image: brunchImage,
    name: 'Brunch',
    items: [
      {
        id: 'avocado-toast',
        name: 'Avocado Toast',
        price: '$12.00',
        description:
          'Fresh avocado on homemade bread, topped with a fried egg.',
      },
      {
        id: 'breakfast-burrito',
        name: 'Breakfast Burrito',
        price: '$10.00',
        description:
          'Scrambled eggs, potatoes, and your choice of meat or vegetables.',
      },
      {
        id: 'belgian-waffles',
        name: 'Belgian Waffles',
        price: '$8.00',
        description: 'Two fluffy waffles topped with fresh berries and cream.',
      },
    ],
  },
  {
    id: 'beverages',
    image: beveragesImage,
    name: 'Beverages',
    items: [
      {
        id: 'soft-drinks',
        name: 'Soft Drinks',
        price: '$3.00',
        description: 'Cola or ginger ale.',
      },
      {
        id: 'lemonade',
        name: 'Lemonade',
        price: '$4.00',
        description: 'Freshly squeezed lemonade with a hint of honey.',
      },
      {
        id: 'iced-tea',
        name: 'Iced Tea',
        price: '$3.00',
        description: 'Freshly brewed iced tea, sweetened or unsweetened.',
      },
    ],
  },
];

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const categoryImages = {
  Cocktails: cocktailsImage,
  'Main Course': brunchImage,
  Appetizers: craftBeerImage,
  Beverages: beveragesImage,
};

const formatPrice = price =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number(price));

const groupMenuItems = items => {
  const groups = new Map();
  for (const item of items) {
    const category = item.category || 'Other';
    if (!groups.has(category)) {
      groups.set(category, {
        id: category,
        name: category,
        image: item.image || categoryImages[category],
        items: [],
      });
    }
    groups.get(category).items.push({
      id: item._id,
      name: item.name,
      price: formatPrice(item.price),
      description: item.description,
    });
  }
  return [...groups.values()];
};

const Menu_card = () => {
  const [menuData, setMenuData] = useState(fallbackMenuData);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    axios
      .get(`${apiUrl}/api/menus`)
      .then(({ data }) => {
        if (!data.success || !Array.isArray(data.menus)) {
          throw new Error('The menu API returned an invalid response.');
        }
        if (active) setMenuData(groupMenuItems(data.menus));
      })
      .catch(error => {
        console.error('Unable to load public menu:', error);
        if (active) setLoadError('Showing the saved menu because live menu items could not be loaded.');
      });
    return () => {
      active = false;
    };
  }, []);

  return (
  <section className="min-h-screen bg-[#FBF7F4] px-4 py-8 sm:px-[5vw] md:px-[5vw] lg:px-[7vw]">
    <div className="container mx-auto max-w-6xl">
      {loadError && <p role="status" className="mb-6 text-center text-sm text-amber-800">{loadError}</p>}
      {menuData.length === 0 ? (
        <p className="py-16 text-center text-gray-600">Menu items will be listed here soon.</p>
      ) : (
      <div className="grid items-stretch gap-8 md:grid-cols-2 lg:gap-10">
        {menuData.map((category, index) => (
          <motion.article
            key={category.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
            whileHover={{ y: -4 }}
            className="flex h-full flex-col overflow-hidden border border-gray-100 bg-white shadow-lg"
          >
            <div className="h-52 w-full overflow-hidden sm:h-60">
              <img
                className="size-full object-cover object-center"
                alt={category.name}
                src={category.image}
                loading="lazy"
              />
            </div>

            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <h2 className="mb-6 border-b border-gray-300 pb-3 font-oswald text-2xl font-semibold uppercase tracking-wide text-[#C94077] sm:text-3xl">
                {category.name}
              </h2>

              <ul className="flex flex-1 flex-col gap-5">
                {category.items.map((item, itemIndex) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.35, delay: itemIndex * 0.04 }}
                    className="flex items-start justify-between gap-4 border-b border-dashed border-gray-300 pb-5 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3">
                        <h3 className="font-oswald text-base font-semibold uppercase tracking-wide text-gray-900 sm:text-lg">
                          {item.name}
                        </h3>
                        <span className="font-oswald text-base font-semibold text-[#C94077] sm:text-lg">
                          {item.price}
                        </span>
                      </div>
                      <p className="font-open-sans text-sm leading-relaxed text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <Link
                to="/contact"
                className="mt-7 inline-flex min-h-11 items-center justify-center rounded-md bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C94077] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C94077]"
              >
                Reserve a table
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
      )}
    </div>
  </section>
  );
};

export default Menu_card;
