import Pagination from "./components/pagination";
import { API_URL, STRAPI_URL } from "./config";
import Link from "next/link";

const getGames = async ({ page = 1 }) => {
  const res = await fetch(`${API_URL}/videogames?populate[platforms][fields][0]=name&populate[cover][fields][0]=url&pagination[page]=${page}&pagination[pageSize]=1`);
  const { data, meta } = await res.json();
  const { pagination } = meta;

  return { data, pagination };
}

const getCoverImage = (attributes) => {
  const { url } = attributes.cover.data.attributes;
  return `${STRAPI_URL}${url}`;
}

export default async function Home({ searchParams }) {
  const { page } = searchParams;
  const { data: videogames, pagination } = await getGames({ page: +page });

  return (
    <main className="flex flex-col items-center gap-5 p-20">
      {
        videogames.map((game, index) => (
          <Link key={index} href="#" className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src={getCoverImage(game.attributes)} alt="" />
            <div className="flex flex-col justify-between p-4 leading-normal">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {game.attributes.title}
              </h5>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {game.attributes.description[0].children.map((item, index) => (
                  item.bold ? (
                    <strong key={index}>{item.text}</strong>
                  ) : (
                    <span key={index}>{item.text}</span>
                  )
                ))}
              </p>
            </div>
          </Link>
        ))
      }
      <Pagination pagination={pagination} />
    </main>
  );
}
