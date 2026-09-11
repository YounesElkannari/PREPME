import { useTranslation } from "react-i18next";
import { Meal } from "@/interfaces/admin";
import { Heart, Clock, ChefHat, Flame, Leaf, CheckCircle2, AlertCircle } from "lucide-react";

import http from "@/utils/http";
import { apiRoutes } from "@/routes/api";
import { handleErrorResponse } from "@/utils";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import ListProductSkeleton from "@/components/skeleton/ListProductSkeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import RelatedProduct from "@/components/products/RelatedProduct";
import VendorContact from "@/components/products/VendorContact";

export const SingleMeal = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();



  const { isLoading, data: mealResponse } = useQuery<{ data: Meal }>({
    queryKey: ["meal", id],
    queryFn: () =>
      http
        .get(apiRoutes.meals + `/${id}`)
        .then((res) => {
          // setIsFavorite(res.data.data.favaris || false);
          return res.data;
        })
        .catch((e) => {
          handleErrorResponse(e);
          throw e;
        }),
  });

  const meal: any = mealResponse?.data;
  const getDietaryBadges = (meal: Meal) => {
    const badges = [];
    // Check both flat and nested structures
    if (meal.dietary_info?.is_vegetarian || meal.is_vegetarian) badges.push({ label: "Vegetarian", color: "bg-green-100 text-green-800" });
    if (meal.dietary_info?.is_vegan || meal.is_vegan) badges.push({ label: "Vegan", color: "bg-green-200 text-green-900" });
    if (meal.dietary_info?.is_gluten_free || meal.is_gluten_free) badges.push({ label: "Gluten Free", color: "bg-blue-100 text-blue-800" });
    if (meal.dietary_info?.is_dairy_free || meal.is_dairy_free) badges.push({ label: "Dairy Free", color: "bg-purple-100 text-purple-800" });
    if (meal.dietary_info?.is_nut_free || meal.is_nut_free) badges.push({ label: "Nut Free", color: "bg-orange-100 text-orange-800" });
    if (meal.dietary_info?.is_keto || meal.is_keto) badges.push({ label: "Keto", color: "bg-red-100 text-red-800" });
    if (meal.dietary_info?.is_paleo || meal.is_paleo) badges.push({ label: "Paleo", color: "bg-yellow-100 text-yellow-800" });
    if (meal.dietary_info?.is_low_carb || meal.is_low_carb) badges.push({ label: "Low Carb", color: "bg-indigo-100 text-indigo-800" });
    if (meal.dietary_info?.is_high_protein || meal.is_high_protein) badges.push({ label: "High Protein", color: "bg-pink-100 text-pink-800" });
    return badges;
  };

  const getDifficultyLevel = (difficulty?: number) => {
    if (difficulty === 1) return 'Easy';
    if (difficulty === 2) return 'Medium';
    if (difficulty === 3) return 'Hard';
    return 'Easy';
  };

  return (
    isLoading ? (
      <ListProductSkeleton />
    ) : (
      <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6 pt-28">
        <div className="grid gap-3 items-start">
          <div className="grid gap-4">
            <img
              src={meal?.image_url || meal?.image_path || "/placeholder.svg"}
              alt="Meal Image"
              width={600}
              height={900}
              className="aspect-[2/3] object-cover border w-full rounded-lg overflow-hidden"
            />
            <div className="hidden md:grid grid-cols-4 gap-3">
              {meal?.gallery_urls && meal.gallery_urls.length > 0 ? (
                meal.gallery_urls.slice(0, 4).map((url: string, index: number) => (
                  <button key={index} className="border hover:border-primary rounded-lg overflow-hidden transition-colors">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Preview thumbnail ${index + 1}`}
                      width={100}
                      height={120}
                      className="aspect-[5/6] object-cover"
                    />
                    <span className="sr-only">View Image {index + 1}</span>
                  </button>
                ))
              ) : (
                Array.from({ length: 4 }).map((_, index) => (
                  <button key={index} className="border hover:border-primary rounded-lg overflow-hidden transition-colors">
                    <img
                      src="/placeholder.svg"
                      alt={`Preview thumbnail ${index + 1}`}
                      width={100}
                      height={120}
                      className="aspect-[5/6] object-cover"
                    />
                    <span className="sr-only">View Image {index + 1}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:gap-10 items-start">
          <div className="grid gap-4">
            <h1 className="font-bold text-3xl lg:text-4xl">{meal?.name}</h1>

            {/* Short Description */}
            {meal?.short_description && (
              <p className="text-lg text-gray-600 dark:text-gray-400">{meal.short_description}</p>
            )}

            {/* Meal Type Badge */}
            {meal?.type && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm text-white px-3 py-1 transition-all duration-300 hover:scale-105 hover:text-white hover:bg-primary hover:border-primary cursor-pointer">
                  {meal.type}
                </Badge>
              </div>
            )}

            {/* Dietary Badges */}
            {meal && getDietaryBadges(meal).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {getDietaryBadges(meal).map((badge, index) => (
                  <Badge key={index} className={`${badge.color} border-0 transition-all duration-300 hover:scale-105 hover:text-white hover:bg-primary hover:border-primary cursor-pointer`}>
                    <Leaf className="h-3 w-3 mr-1" />
                    {badge.label}
                  </Badge>
                ))}
              </div>
            )}

            {/* Nutritional Information */}
            <div className="grid gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t("meal.nutritional_info")}</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(meal?.nutrition?.calories || meal?.calories) && (
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <Flame className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{meal.nutrition?.calories || meal.calories}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("meal.calories")}</div>
                  </div>
                )}
                {(meal?.nutrition?.protein || meal?.protein) && (
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <ChefHat className="h-6 w-6 text-red-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{meal.nutrition?.protein || meal.protein}g</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("meal.protein")}</div>
                  </div>
                )}
                {(meal?.nutrition?.carbohydrates || meal?.carbohydrates) && (
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <Leaf className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{meal.nutrition?.carbohydrates || meal.carbohydrates}g</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("meal.carbs")}</div>
                  </div>
                )}
                {(meal?.nutrition?.fats || meal?.fats) && (
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <Heart className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{meal.nutrition?.fats || meal.fats}g</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("meal.fats")}</div>
                  </div>
                )}
                {(meal?.nutrition?.fiber || meal?.fiber) && (
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <Leaf className="h-6 w-6 text-green-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{meal.nutrition?.fiber || meal.fiber}g</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("meal.fiber")}</div>
                  </div>
                )}
                {(meal?.nutrition?.sodium || meal?.sodium) && (
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{meal.nutrition?.sodium || meal.sodium}mg</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("meal.sodium")}</div>
                  </div>
                )}
                {(meal?.nutrition?.sugar || meal?.sugar) && (
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <Flame className="h-6 w-6 text-pink-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{meal.nutrition?.sugar || meal.sugar}g</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t("meal.sugar")}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Preparation Details */}
            <div className="grid gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t("meal.preparation_details")}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(meal?.preparation?.prep_time_minutes || meal?.prep_time_minutes) && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("meal.prep_time")}</div>
                      <div className="text-lg font-bold">{meal.preparation?.prep_time_minutes || meal.prep_time_minutes} min</div>
                    </div>
                  </div>
                )}
                {(meal?.preparation?.cooking_time_minutes || meal?.cooking_time_minutes) && (
                  <div className="flex items-center gap-3">
                    <ChefHat className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("meal.cook_time")}</div>
                      <div className="text-lg font-bold">{meal.preparation?.cooking_time_minutes || meal.cooking_time_minutes} min</div>
                    </div>
                  </div>
                )}
                {(meal?.preparation?.total_time_minutes || meal?.total_time_minutes) && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("meal.total_time")}</div>
                      <div className="text-lg font-bold">{meal.preparation?.total_time_minutes || meal.total_time_minutes} min</div>
                    </div>
                  </div>
                )}
                {(meal?.preparation?.difficulty_level || meal?.difficulty_level) && (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("meal.difficulty")}</div>
                      <Badge variant="outline" className="font-medium transition-all duration-300 hover:scale-105 hover:text-white hover:bg-primary hover:border-primary cursor-pointer">
                        {getDifficultyLevel(meal.preparation?.difficulty_level || meal.difficulty_level)}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Serving Info */}
              {(meal?.serving_size || meal?.weight_grams) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                  {meal?.serving_size && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("meal.serving_size")}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{meal.serving_size}</span>
                    </div>
                  )}
                  {meal?.weight_grams && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("meal.weight")}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{meal.weight_grams}g</span>
                    </div>
                  )}
                </div>
              )}

              {/* Spice Level */}
              {meal?.is_spicy && meal?.spice_level && (
                <div className="flex items-center gap-3 pt-2 border-t">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("meal.spice_level")}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <Flame
                          key={level}
                          className={`h-4 w-4 ${level <= (meal.spice_level || 0) ? 'text-red-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              {/* <div className="text-4xl font-bold">
                {typeof meal?.price === 'number' ? meal.price.toFixed(2) : meal?.price} {t("menu.currency")}
              </div> */}
              {meal?.cost_per_serving && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Cost per serving: {typeof meal.cost_per_serving === 'number' ? meal.cost_per_serving.toFixed(2) : meal.cost_per_serving} {t("currency")}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="grid gap-4 text-sm leading-loose">
            {meal?.description}
          </div>

          {/* Ingredients */}
          {meal?.ingredients && (
            <div className="grid gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t("meal.ingredients")}</h3>
              {Array.isArray(meal.ingredients) ? (
                <ul className="list-disc list-inside space-y-1">
                  {meal.ingredients.map((ingredient: any, index: number) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{ingredient}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{meal.ingredients}</p>
              )}
            </div>
          )}

          {/* Allergens */}
          {meal?.allergens && (
            <div className="grid gap-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">{t("meal.allergen_info")}</h3>
              <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">{meal.allergens}</p>
            </div>
          )}

          {/* Preparation Instructions */}
          {(meal?.preparation_instructions || meal?.preparation?.instructions) && (
            <div className="grid gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t("meal.preparation_instructions")}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {meal.preparation_instructions || meal.preparation?.instructions}
              </p>
            </div>
          )}

          {/* Storage Instructions */}
          {(meal?.storage_instructions || meal?.preparation?.storage_instructions) && (
            <div className="grid gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">{t("meal.storage_instructions")}</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                {meal.storage_instructions || meal.preparation?.storage_instructions}
              </p>
            </div>
          )}

          {/* Chef Notes */}
          {meal?.chef_notes && (
            <div className="grid gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                {t("meal.chef_notes")}
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">{meal.chef_notes}</p>
            </div>
          )}
          {/* 
          <form className="grid gap-4 md:gap-10">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="flex-1">
                Order Meal
              </Button>
              <Button
                size="lg"
                variant={isFavorite ? "default" : "outline"}
                className={`flex items-center gap-2 ${isFavorite ? 'bg-red-600 hover:bg-red-700' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsFavorite(!isFavorite);
                  addToFavorite(meal?.id)
                }}
                type="button"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-white' : ''}`} />
                {isFavorite ? "Added to Favorites" : "Add to Favorites"}
              </Button>
            </div>
          </form> */}

          {/* Vendor Contact Section */}
          {meal?.user && (
            <div className="grid gap-4">
              <VendorContact vendor={meal.user} productId={meal.id} />
            </div>
          )}

          <div className="grid gap-4">
            <h2 className="font-bold text-lg">{t("meal.related_meals")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {meal?.relatedProducts?.length > 0 ? (
                meal.relatedProducts.map((relatedMeal: any) => (
                  <RelatedProduct key={relatedMeal.id} product={relatedMeal} />
                ))
              ) : (
                <p className="text-muted-foreground">{t("meal.no_related_meals")}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default SingleMeal;
