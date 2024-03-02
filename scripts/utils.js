export const feedData = (selectID, data, contentOption) => {
  let keyText, keyValue = ''

  if (contentOption) {
    keyText = contentOption.split(',')
    keyValue = keyText[1] ?? keyText[0]
    keyText = keyText[0]
    removeOptions(selectID)
  } else {
    removeOptions(selectID, 0)
  }

  for (let i = 0; i < data['length']; i++) {
    let option = document.createElement('option')
    option.text = contentOption ? data[i][keyText] : data[i]
    option.value = contentOption ? data[i][keyValue] : data[i]
    selectID.add(option)
  }
}

export const handleOperatorsByPropertyType = (propertyType, operators) => {
  let positionsToReturn = [0, 3, 4, 5]

  if (propertyType === 'string') {
    positionsToReturn.push(6)
  }

  if (propertyType === 'number') {
    positionsToReturn = [...positionsToReturn, 1, 2]
  }

  return positionsToReturn.map(index => operators[index])
}

function removeOptions(selectBox, fromPosition) {
  while (selectBox.options.length > 0) {
    selectBox.remove(fromPosition ?? 1)
  }
}

export const mountTable = (products) => {
  let dataTable = ''
  products.forEach(({ property_values }) => {
    dataTable += `<tr>`
    property_values
      .forEach(({ value }, index) => {
      dataTable += `<td>${value ?? ''}</td>`
      if (property_values.length === 4 && index === 3) {
        property_values.push({ property_id: index+1, value: null})
        dataTable += `<td></td>`
      }
    })
    dataTable += `</tr>`
  })

  document.querySelector('tbody').innerHTML = dataTable
}

export const filterResults = (products, searchBy, criterion, typeSearch, propertyID) => {
  const productsList = products.reduce((acc, a) => {
    const ch = a.property_values.filter(
      product => {
          return product?.property_id === parseInt(propertyID) &&
            filterCriteria(criterion, searchBy, product, typeSearch)
      }
    )

    if(ch && ch.length) acc.push({...a})
    return acc
  }, [])

  mountTable(productsList)
}

export function filterCriteria(operator, searchTerm, obj, typeSearch) {
  let searchBy = typeSearch === 'number' ? parseInt(searchTerm) : searchTerm
  let valuesArray = [];
  if (operator === 'in') {
    if (!searchTerm.includes(',')) {
      operator = 'equals'
    } else {
      let terms = searchTerm.split(',')

      for (const key in terms) {
        valuesArray.push(
          typeSearch === 'number' ?
          parseInt(terms[key].trim()) :
          terms[key].trim()
        );
      }
    }
  }

  if (Array.isArray(searchTerm)) {
    operator = 'in'
    valuesArray = searchTerm
  }

  const criteria = {
    'equals': () => obj['value'] === searchBy,
    'greater_than': () => obj['value'] > searchBy,
    'less_than': () =>  obj['value'] < searchBy,
    'any': () =>  obj['value'],
    'none': () =>  !obj['value'] || obj['value'] === undefined,
    'in': () =>  valuesArray.includes(obj['value']),
    'contains': () => typeof obj['value'] === 'string' &&
      obj['value'].toLowerCase().indexOf(searchBy) >= 0,
  }

  return criteria[operator]()
}
