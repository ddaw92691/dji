import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, type ProductItem } from "../services/product";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useI18n } from "../i18n";

export default function ProductListPage() {
  const { locale, t } = useI18n();
  const [params] = useSearchParams();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(params.get("sort") || "latest");
  const categoryId = params.get("categoryId");

  useEffect(() => {
    setLoading(true);
    api
      .getProducts({
        page,
        pageSize: 12,
        categoryId: categoryId || undefined,
        sort,
      })
      .then((r) => {
        if (r.data.code === 200) {
          setProducts(r.data.data.list);
          setTotal(r.data.data.total);
        }
      })
      .finally(() => setLoading(false));
  }, [page, sort, categoryId, locale.id]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-bold">
              {t("website.products.title")}
            </h1>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white"
            >
              <option value="latest" className="bg-gray-800">
                {t("website.products.sort.latest")}
              </option>
              <option value="priceAsc" className="bg-gray-800">
                {t("website.products.sort.priceAsc")}
              </option>
              <option value="priceDesc" className="bg-gray-800">
                {t("website.products.sort.priceDesc")}
              </option>
              <option value="salesDesc" className="bg-gray-800">
                {t("website.products.sort.salesDesc")}
              </option>
            </select>
          </div>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              {t("website.common.empty")}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group block"
                >
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-white/5 mb-4">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{p.categoryName}</p>
                  <h3 className="font-medium text-sm text-gray-200 group-hover:text-white line-clamp-2">
                    {p.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-bold">${p.price}</span>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="text-xs text-gray-500 line-through">
                        ${p.originalPrice}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
          {total > 12 && (
            <div className="flex justify-center gap-4 mt-12">
              {page > 1 && (
                <button
                  onClick={() => setPage((p) => p - 1)}
                  className="px-6 py-2 border border-white/30 rounded-full text-sm hover:bg-white/10"
                >
                  {t("website.common.previous")}
                </button>
              )}
              {page * 12 < total && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-6 py-2 border border-white/30 rounded-full text-sm hover:bg-white/10"
                >
                  {t("website.common.next")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
