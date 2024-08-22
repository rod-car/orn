import { ArticleAdd, ArticleEdit, ArticleList, ArticleShow, PriceAdd, PriceHome, PriceList, SiteAdd, SiteEdit, SiteList, UnitAdd, UnitEdit, UnitList } from "@base/pages/Prices";
import { RouteObject } from "react-router";

export const priceRoute: RouteObject[] = [
    {
        path: 'manage',
        element: <PriceHome />
    },
    {
        path: 'manage/add',
        element: <PriceAdd />
    },
    {
        path: 'manage/list',
        element: <PriceList />
    },
    {
        path: 'articles',
        children: [
            {
                path: 'add',
                element: <ArticleAdd />
            },
            {
                path: 'edit/:id',
                element: <ArticleEdit />
            },
            {
                path: 'show/:id',
                element: <ArticleShow />
            },
            {
                path: 'list',
                element: <ArticleList />
            }
        ]
    },
    {
        path: 'units',
        children: [
            {
                path: 'add',
                element: <UnitAdd />
            },
            {
                path: 'edit/:id',
                element: <UnitEdit />
            },
            {
                path: 'list',
                element: <UnitList />
            }
        ]
    },
    {
        path: 'sites',
        children: [
            {
                path: 'add',
                element: <SiteAdd />
            },
            {
                path: 'edit/:id',
                element: <SiteEdit />
            },
            {
                path: 'list',
                element: <SiteList />
            }
        ]
    }
]