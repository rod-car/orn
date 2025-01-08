import { PrivateRoute } from "@base/components/Auth/";
import { ArticleAdd, ArticleEdit, ArticleList, ArticleShow, PriceAdd, PriceHome, PriceList, SiteAdd, SiteEdit, SiteList, UnitAdd, UnitEdit, UnitList } from "@base/pages/Prices";
import { RouteObject } from "react-router";

export const priceRoute: RouteObject[] = [
    {
        path: 'manage',
        element: <PrivateRoute can={['admin']}>
            <PriceHome />
        </PrivateRoute>
    },
    {
        path: 'manage/add',
        element: <PrivateRoute can={['admin']}>
            <PriceAdd />
        </PrivateRoute>
    },
    {
        path: 'manage/list',
        element: <PrivateRoute can={['admin']}>
            <PriceList />
        </PrivateRoute>
    },
    {
        path: 'articles',
        children: [
            {
                path: 'add',
                element: <PrivateRoute can={['admin']}>
                    <ArticleAdd />
                </PrivateRoute>
            },
            {
                path: 'edit/:id',
                element: <PrivateRoute can={['admin']}>
                    <ArticleEdit />
                </PrivateRoute>
            },
            {
                path: 'show/:id',
                element: <PrivateRoute can={['admin']}>
                    <ArticleShow />
                </PrivateRoute>
            },
            {
                path: 'list',
                element: <PrivateRoute>
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
                element: <PrivateRoute can={['admin']}>
                    <UnitAdd />
                </PrivateRoute>
            },
            {
                path: 'edit/:id',
                element: <PrivateRoute can={['admin']}>
                    <UnitEdit />
                </PrivateRoute>
            },
            {
                path: 'list',
                element: <PrivateRoute>
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
                element: <PrivateRoute can={['admin']}>
                    <SiteAdd />
                </PrivateRoute>
            },
            {
                path: 'edit/:id',
                element: <PrivateRoute can={['admin']}>
                    <SiteEdit />
                </PrivateRoute>
            },
            {
                path: 'list',
                element: <PrivateRoute>
                    <SiteList />
                </PrivateRoute>
            }
        ]
    }
]