import styles from "../../../styles/navbar.module.css"

export default function Faq() {
    return (
        <div className="text-white">
            <h2 className="text-xs font-bold mb-4">Scene Landpage</h2>
            <p className="mb-4 text-xs">License: CC Attribution</p>
            <p className="text-xs mb-2">Author: Sebastian Sosnowski</p>
            <a href="https://sketchfab.com/3d-models/star-cluster-15k-stars-model-51148b78a37a4a72b22d8e06f4293e07" className={`text-xs text-blue-300 ${styles.transitionFont}`}>
                Link
            </a>
        </div>
    )
}