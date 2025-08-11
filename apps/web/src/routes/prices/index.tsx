import { PrivateRoute } from "@base/components/Auth/";
import { ArticleAdd, ArticleEdit, ArticleList, PriceAdd, PriceList, SiteAdd, SiteEdit, SiteList, UnitAdd, UnitEdit, UnitList, PriceRecap } from "@base/pages/Prices";
import { RouteObject } from "react-router";

export const priceRoute: RouteObject[] = [
    {
        path: 'manage/add',
        element: <PrivateRoute permission="price.create">
            <PriceAdd />
        </PrivateRoute>
    },
    {
        path: 'manage/list',
        element: <PrivateRoute permission="price.view">
            <PriceList />
        </PrivateRoute>
    },
    {
        path: 'manage/recap',
        element: <PrivateRoute permission="price.show">
            <PriceRecap />
        </PrivateRoute>
    },
    {
        path: 'articles',
        children: [
            {
                path: 'add',
                element: <PrivateRoute permission="article.create">
                    <ArticleAdd />
                </PrivateRoute>
            },
            {
                path: 'edit/:id',
                element: <PrivateRoute permission="article.edit">
                    <ArticleEdit />
                </PrivateRoute>
            },
            {
                path: 'list',
                element: <PrivateRoute permission="article.view">
                    <ArticleList />
                </PrivateRoute>
            }
        ]
    },
    {
        path: 'units',
        children: [
            {
                path: 'add',
                element: <PrivateRoute permission="unit.create">
                    <UnitAdd />
                </PrivateRoute>
            },
            {
                path: 'edit/:id',
                element: <PrivateRoute permission="unit.edit">
                    <UnitEdit />
                </PrivateRoute>
            },
            {
                path: 'list',
                element: <PrivateRoute permission="unit.view">
                    <UnitList />
                </PrivateRoute>
            }
        ]
    },
    {
        path: 'sites',
        children: [
            {
                path: 'add',
                element: <PrivateRoute permission="site.create">
                    <SiteAdd />
                </PrivateRoute>
            },
            {
                path: 'edit/:id',
                element: <PrivateRoute permission="site.edit">
                    <SiteEdit />
                </PrivateRoute>
            },
            {
                path: 'list',
                element: <PrivateRoute permission="site.view">
                    <SiteList />
                </PrivateRoute>
            }
        ]
    }
]