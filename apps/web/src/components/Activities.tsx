import { ReactNode, useMemo } from "react"
import { ActivityLoading, PrimaryLink } from "@base/components"
import { range } from "functions"
import { PhotoProvider, PhotoView } from "react-photo-view"
import 'react-photo-view/dist/react-photo-view.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import placeholder from "@base/assets/images/placeholder.webp"

import './ActivityBlock.scss'

export const Loading = ({ count = 8 }: { count?: number }) => {
    return <div className="row">{range(count).map(index => <div key={index} className="mb-4 col-xl-3"><ActivityLoading reverse={index % 2 === 0} /></div>)}</div>
}

type ActivityBlockProps = {
    activity: Activity;
    single?: boolean;
}

function truncateHtml(html: string, wordLimit: number): string {
    const doc = new DOMParser().parseFromString(html, "text/html");
    let wordCount = 0;
    let truncated = false;

    function processNode(node: Node): boolean {
        if (truncated) return false;

        if (node.nodeType === Node.TEXT_NODE) {
            const textNode = node as Text;
            const text = textNode.nodeValue || "";
            const words = text.trim().split(/\s+/).filter(word => word.length > 0);

            if (wordCount + words.length > wordLimit) {
                const remainingWords = wordLimit - wordCount;
                if (remainingWords > 0) {
                    textNode.nodeValue = words.slice(0, remainingWords).join(" ") + "...";
                } else {
                    textNode.nodeValue = "";
                }
                truncated = true;
                return false;
            } else {
                wordCount += words.length;
                return true;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const children = Array.from(node.childNodes);
            for (let i = 0; i < children.length; i++) {
                if (!processNode(children[i])) {
                    // Supprimer tous les nœuds suivants
                    for (let j = i + 1; j < children.length; j++) {
                        node.removeChild(children[j]);
                    }
                    break;
                }
            }
        }

        return !truncated;
    }

    processNode(doc.body);

    // Nettoyer les éléments vides après troncature
    function cleanEmptyElements(element: Element): void {
        const children = Array.from(element.children);

        for (const child of children) {
            cleanEmptyElements(child);

            // Supprimer si l'élément est complètement vide (pas de texte ni d'enfants)
            if (child.children.length === 0 &&
                (child.textContent || "").trim() === "") {
                child.remove();
            }
        }
    }

    cleanEmptyElements(doc.body);

    return doc.body.innerHTML;
}

export const ActivityBlock = ({ activity, single = false }: ActivityBlockProps): ReactNode => {
    const images = activity.images || [];
    const hasImages = images.length > 0;

    const truncatedDetails = useMemo(
        () => truncateHtml(activity.details, 30), // 30 mots max
        [activity.details]
    );

    return (
        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12" key={activity.id}>
            <div className="card rounded shadow-lg">
                {hasImages && (
                    <PhotoProvider>
                        <PhotoView src={images[0].path}>
                            <div style={{ cursor: 'pointer' }}>
                                <LazyLoadImage
                                    alt={`Image principale`}
                                    src={images[0].path}
                                    effect="blur"
                                    placeholderSrc={placeholder}
                                    placeholder={<p>Chargement de l'image</p>}
                                    style={{
                                        width: '100%',
                                        height: '250px',
                                        maxHeight: '250px',
                                        objectFit: 'cover',
                                        objectPosition: 'top',
                                        borderTopLeftRadius: '0.5rem',
                                        borderTopRightRadius: '0.5rem'
                                    }}
                                />
                            </div>
                        </PhotoView>

                        {images.slice(1).map((image, idx) => (
                            <PhotoView key={idx + 1} src={image.path}>
                                <div style={{ display: 'none' }} />
                            </PhotoView>
                        ))}
                    </PhotoProvider>
                )}

                <div className="p-3">
                    <h5 className="text-primary">{activity.title}</h5>
                    <h6 className="mb-3 text-muted">
                        {activity.place} - {activity.date}
                    </h6>
                    <hr />
                    <p dangerouslySetInnerHTML={{ __html: truncatedDetails }}></p>
                </div>

                <div className="card-footer">
                    {!single && (
                        <PrimaryLink permission="activity.show" icon="eye" to={`/activities/show/${activity.id}`}>
                            Plus de détails
                        </PrimaryLink>
                    )}
                </div>
            </div>
        </div>
    );
};