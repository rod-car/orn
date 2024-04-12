import React from 'react'

export function Children(): React.ReactElement {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1>Liste des enfants</h1>
        <a href="/student/add" className="btn btn-primary">
          <i className="fa fa-plus me-2"></i>Nouveau
        </a>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prenoms</th>
            <th>Age</th>
            <th style={{ width: '15%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => (
            <tr key={id}>
              <td>{id}</td>
              <td>RAKOTO</td>
              <td>Beloha</td>
              <td>10</td>
              <td>
                <a className="btn-sm me-2 btn btn-primary" href="#">
                  <i className="fa fa-edit"></i>
                </a>
                <a className="btn-sm me-2 btn btn-secondary" href="#">
                  <i className="fa fa-folder"></i>
                </a>
                <a className="btn-sm btn btn-danger" href="#">
                  <i className="fa fa-trash"></i>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
