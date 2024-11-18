import React, { useState } from 'react';

import AxiosTools from '../../utils/Axios';

import { Catalogs } from '../../utils/Constants';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

interface TableRowProps {
    item: Catalogs,
    handleUpdateProduct: (updatedItem: Catalogs) => void,
    handleDeleteProduct: (id: number) => void
}

const TableRow = (props: TableRowProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedItem, setEditedItem] = useState<Catalogs>(props.item);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedItem(props.item);
  };

  const handleSave = () => {
    // Logique pour enregistrer les modifications
    setIsEditing(false);
    
    AxiosTools.put(`/products/${editedItem.id}`, editedItem, (response: any) => {
        props.handleUpdateProduct(response.data);
    });
  };

  const handleDelete = () => {
    props.handleDeleteProduct(editedItem.id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedItem({ ...editedItem, [name]: value });
  };

  return (
    <tr>
        <td>{editedItem.id}</td>
        <td>{isEditing ? <input type="text" name="name" value={editedItem.name} onChange={handleChange} /> : editedItem.name}</td>
        <td>{isEditing ? <input type="text" name="description" value={editedItem.description} onChange={handleChange} /> : editedItem.description}</td>
        <td>{isEditing ? <input type="text" name="photo" value={editedItem.photo} onChange={handleChange} /> : editedItem.photo}</td>
        <td>{isEditing ? <input type="text" name="price" value={editedItem.price} onChange={handleChange} /> : editedItem.price}</td>
        <td>{isEditing ? <input type="text" name="brand" value={editedItem.brand} onChange={handleChange} /> : editedItem.brand}</td>
        <td>{isEditing ? <input type="text" name="resolution" value={editedItem.resolution} onChange={handleChange} /> : editedItem.resolution}</td>
        <td>{isEditing ? <input type="text" name="size" value={editedItem.size} onChange={handleChange} /> : editedItem.size}</td>
        <td>{isEditing ? <input type="text" name="technology" value={editedItem.technology} onChange={handleChange} /> : editedItem.technology}</td>
        <td>{isEditing ? <input type="text" name="connectivity" value={editedItem.connectivity} onChange={handleChange} /> : editedItem.connectivity}</td>
        <td>
            {isEditing ? (
                <select name="is_smart_tv" value={editedItem.is_smart_tv ? "1" : "0"} onChange={handleChange}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                </select>
            ) : (
                editedItem.is_smart_tv ? "oui" : "non"
            )}
        </td>
        <td>
            {
                isEditing ? (
                    <span className="d-flex flex-row justify-content-around align-items-center">
                        <FontAwesomeIcon icon={faCheck} onClick={handleSave} style={{color: "green", height: "1.25em"}} />
                        <FontAwesomeIcon icon={faTimes} onClick={handleCancel} style={{color: "red", height: "1.25em"}} />
                    </span>
                ) : (
                    <span className="d-flex flex-row justify-content-around align-items-center">
                        <FontAwesomeIcon icon={faPenToSquare} onClick={handleEdit} style={{height: "1.25em"}}/>
                        <FontAwesomeIcon icon={faTrash} onClick={handleDelete} style={{color: "red", height: "1.25em"}} />
                    </span>
                )
            }
        </td>
    </tr>
  );
}

export default TableRow;