import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, type ProductItem } from "../services/product";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useI18n } from "../i18n";

export default function ProductDetailPage() {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    api
      .getProductDetail(Number(id))
      .then((r) => {
        if (r.data.code === 200) setProduct(r.data.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        {t("website.products.notFound")}
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-white/5">
                <img
                  src={
                    product.images?.[mainImg]?.imageUrl || product.coverImage
                  }
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImg(i)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${mainImg === i ? "border-white" : "border-transparent"}`}
                    >
                      <img
                        src={img.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm text-gray-400 mb-2">
                {product.categoryName}
              </p>
              <h1 className="text-2xl md:text-4xl font-bold">
                {product.title}
              </h1>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <span className="text-lg text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
              </div>
              <p className="mt-4 text-gray-400 leading-relaxed">
                {product.description}
              </p>
              <div className="mt-4 text-sm text-gray-500">
                <span>
                  {product.salesCount || 0} {t("website.products.sold")}
                </span>
                <span className="ml-4">
                  {t("website.products.category")}: {product.categoryName}
                </span>
              </div>
              <div className="mt-8 flex gap-4">
                <a
                  href={`http://localhost:4173/products/${id}`}
                  target="_blank"
                  rel="noopener"
                  className="flex-1 text-center px-8 py-3.5 bg-white text-black rounded-full text-base font-semibold hover:bg-gray-200 transition-colors"
                >
                  {t("website.common.buyNow")} →
                </a>
                <Link
                  to="/products"
                  className="px-8 py-3.5 border border-white/30 rounded-full text-base font-semibold hover:bg-white/10 transition-colors"
                >
                  {t("website.common.back")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
