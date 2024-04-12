import React, { FormEvent } from 'react'

export function AddChildren(): React.ReactElement {
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()

    alert('Hello world')
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1>Ajouter un étudiant</h1>
        <a href="/student" className="btn btn-primary">
          <i className="fa fa-list me-2"></i>Liste
        </a>
      </div>

      <form action="" onSubmit={handleSubmit} method="post">
        <div className="row mb-3">
          <div className="col-xl-1">
            <div className="form-group">
              <label className="form-label fw-bold text-muted">Numero</label>
              <input type="text" className="form-control" value="1" />
            </div>
          </div>
          <div className="col-xl-5">
            <div className="form-group">
              <label className="form-label fw-bold text-muted">Nom</label>
              <input type="text" className="form-control" value="RAKOTO" />
            </div>
          </div>
          <div className="col-xl-6">
            <div className="form-group">
              <label className="form-label fw-bold text-muted">Nom</label>
              <input type="text" className="form-control" value="Beloha" />
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-xl-3">
            <div className="form-group">
              <label className="form-label fw-bold text-muted">Sexe</label>
              <select name="" id="" className="form-select">
                <option value="">Garcon</option>
                <option value="">Fille</option>
              </select>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="form-group">
              <label className="form-label fw-bold text-muted">Date de naissance</label>
              <input type="date" className="form-control" value="2021-01-01" />
            </div>
          </div>
          <div className="col-xl-6">
            <div className="form-group">
              <label className="form-label fw-bold text-muted">Lieu de naissance</label>
              <input type="text" className="form-control" value="Toamasina" />
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-xl-6">
            <div className="form-group">
              <label className="form-label fw-bold text-muted">Pere</label>
              <input type="text" className="form-control" value="RABE" />
            </div>
          </div>
          <div className="col-xl-6">
            <div className="form-group">
              <label className="form-label fw-bold text-muted">Mere</label>
              <input type="text" className="form-control" value="Soa" />
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-xl-6">
            <div className="form-group">
              <label className="form-label fw-bold text-muted">Ecole</label>
              <select name="" id="" className="form-select">
                <option value="">Selectionner une ecole</option>
                <option value="CM1">EPP Romualo</option>
                <option value="CM2">EPP Ampasimadinika</option>
              </select>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="form-group">
              <label className="form-label fw-bold text-muted">Classe</label>
              <select name="" id="" className="form-select">
                <option value="">Selectionner une classe</option>
                <option value="CM1">CM 1</option>
                <option value="CM2">CM 2</option>
              </select>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="form-group">
              <label className="form-label fw-bold text-muted">
                Niveau (<span className="text-warning">auto</span>)
              </label>
              <select name="" id="" className="form-select">
                <option value="CM1">Primaire</option>
                <option value="CM2">Prescolaire</option>
              </select>
            </div>
          </div>
        </div>

        <button className="btn btn-primary" type="submit">
          <i className="fa fa-save me-2"></i>Valider
        </button>
      </form>
    </>
  )
}
