import React from 'react'
import {
  NavSelect,
  NavSelectContent,
  NavSelectItem,
  NavSelectTrigger,
  NavSelectValue,
} from '../nav-select'

const CategorySelector = () => {
  return (
    <NavSelect>
      <NavSelectTrigger>
        <NavSelectValue placeholder="Categorias" />
      </NavSelectTrigger>
      <NavSelectContent>
        <NavSelectItem value="fiction">Ficção</NavSelectItem>
        <NavSelectItem value="romance">Romance</NavSelectItem>
        <NavSelectItem value="sci-fi">Ficção Científica</NavSelectItem>
      </NavSelectContent>
    </NavSelect>
  )
}

export default CategorySelector
