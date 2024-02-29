export const feedData = (selectID, data, contentOption) => {
  removeAll(selectID)
  let keyText, keyValue = ''

  if (contentOption) {
    keyText = contentOption.split(',')
    keyValue = keyText[1] ?? keyText[0]
    keyText = keyText[0]
  }

  for (let i = 0; i < data['length']; i++) {
    let option = document.createElement('option');
    option.text = contentOption ? data[i][keyText] : data[i];
    option.value = contentOption ? data[i][keyValue] : data[i];
    selectID.add(option);
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

function removeAll(selectBox) {
  while (selectBox.options.length > 1) {
    selectBox.remove(1);
  }
}

export const mountTable = (products) => {
  let dataTable = '';
  products.forEach(({ id, property_values }) => {
    dataTable += `<tr>`
    property_values.forEach(({ value }, index) => {
      dataTable += `<td>${value}</td>`
      if (property_values.length === 4 && index === 3) {
        dataTable += `<td></td>`
      }
    })
    dataTable += `</tr>`
  })

  document.querySelector('tbody').innerHTML = dataTable
}
