import '../scripts/datastore'
import contentHandler, { ui } from '../scripts/contentHandler'

describe('Home', () => {
  const delay = 500
  let propertyFilter, operatorFilter, enumeratedFilter, valueFilter, clearButton

  jest.useFakeTimers()

  beforeEach(() => {
    document.body.innerHTML = `
    <form id="filtersForm">
      <fieldset>
        <legend class="screen-reader-only">Available filters</legend>
        <select id="propertyFilter">
          <option value="">Select a Property</option>
        </select>

        <select id="operatorFilter" disabled>
          <option value="">Select an Operator</option>
        </select>

        <select id="enumeratedFilter" multiple hidden>
        </select>

        <input type="text" id="valueFilter" placeholder="Enter the value"
          aria-label="Enter the value" hidden>

        <input type="hidden" id="propertyType">
      </fieldset>

      <button aria-label="Clear filters" disabled id="clearButton">Clear</button>
    </form>

    <table id="filterResult" role="table" summary="List of Products and their properties">
      <caption class="screen-reader-only">Condition Editor Results</caption>
      <thead role="rowgroup">
        <tr>
          <th scope="col">Product Name</th>
          <th scope="col">Color</th>
          <th scope="col">Weight (oz)</th>
          <th scope="col">Category</th>
          <th scope="col">Wireless</th>
        </tr>
      </thead>

      <tbody></tbody>
    </table>
    `

    propertyFilter = document.querySelector('#propertyFilter')
    operatorFilter = document.querySelector('#operatorFilter')
    enumeratedFilter = document.querySelector('#enumeratedFilter')
    valueFilter = document.querySelector('#valueFilter')
    clearButton = document.querySelector('#clearButton')

    callback = jest.fn()
    contentHandler()
  })

  it('should get all products from the datastore on the application load', () => {
    expect(document.querySelectorAll('tbody tr').length).toBe(6)
  })

  it('should filter by the name of the product with any or equals operator', () => {
    propertyFilter.value = 1
    propertyFilter.dispatchEvent(new Event('change'))

    expect(operatorFilter.getAttribute('disabled')).toBe(null)

    operatorFilter.value = 'any'
    operatorFilter.dispatchEvent(new Event('change'))
    expect(valueFilter.getAttribute('hidden')).toBe('true')

    expect(document.querySelectorAll('tbody tr').length).toBe(6)

    operatorFilter.value = 'equals'
    operatorFilter.dispatchEvent(new Event('change'))
    expect(valueFilter.getAttribute('hidden')).toBe(null)

    valueFilter.value = 'silver'
    valueFilter.dispatchEvent(new Event('keyup'))
    jest.advanceTimersByTime(delay)

    expect(document.querySelectorAll('tbody tr').length).toBe(1)
  })

  it('should filter by the number type', () => {
    propertyFilter.value = 2
    propertyFilter.dispatchEvent(new Event('change'))

    operatorFilter.value = 'greater_than'
    operatorFilter.dispatchEvent(new Event('change'))

    valueFilter.value = 10
    valueFilter.dispatchEvent(new Event('keyup'))
    jest.advanceTimersByTime(delay)

    expect(document.querySelectorAll('tbody tr').length).toBe(1)

    operatorFilter.value = 'less_than'
    operatorFilter.dispatchEvent(new Event('change'))

    valueFilter.value = 5
    valueFilter.dispatchEvent(new Event('keyup'))
    jest.advanceTimersByTime(delay)

    expect(document.querySelectorAll('tbody tr').length).toBe(3)
  })

  it('should filter by the enumerated type', () => {
    propertyFilter.value = 3
    propertyFilter.dispatchEvent(new Event('change'))

    expect(valueFilter.getAttribute('hidden')).toBe("true")

    operatorFilter.value = 'equals'
    operatorFilter.dispatchEvent(new Event('change'))
    expect(enumeratedFilter.getAttribute('hidden')).toBe(null)

    enumeratedFilter.value = 'tools'
    enumeratedFilter.dispatchEvent(new Event('change'))
    jest.advanceTimersByTime(delay)

    expect(document.querySelectorAll('tbody tr').length).toBe(2)
  })

  it('should filter by the IN operator', () => {
    propertyFilter.value = 0
    propertyFilter.dispatchEvent(new Event('change'))

    operatorFilter.value = 'in'
    operatorFilter.dispatchEvent(new Event('change'))

    valueFilter.value = 'Headphones, Key'
    valueFilter.dispatchEvent(new Event('keyup'))
    jest.advanceTimersByTime(delay)

    expect(document.querySelectorAll('tbody tr').length).toBe(2)
  })

  it('should filter by the CONTAINS operator', () => {
    propertyFilter.value = 0
    propertyFilter.dispatchEvent(new Event('change'))

    operatorFilter.value = 'contains'
    operatorFilter.dispatchEvent(new Event('change'))

    valueFilter.value = 'phone'
    valueFilter.dispatchEvent(new Event('keyup'))
    jest.advanceTimersByTime(delay)

    expect(document.querySelectorAll('tbody tr').length).toBe(2)
  })

  it('should filter by the gas no value operator', () => {
    propertyFilter.value = 4
    propertyFilter.dispatchEvent(new Event('change'))

    operatorFilter.value = 'none'
    operatorFilter.dispatchEvent(new Event('change'))

    expect(document.querySelectorAll('tbody tr').length).toBe(3)
  })

  it('should clear all the filters on click on Clear button', () => {
    propertyFilter.value = 1
    propertyFilter.dispatchEvent(new Event('change'))

    clearButton.click()
    expect(propertyFilter.value).toBe('')
  })

  it('should clear all the filters on choose no option on property select', () => {
    propertyFilter.value = ''
    propertyFilter.dispatchEvent(new Event('change'))

    expect(operatorFilter.getAttribute('disabled')).toBe('true')
  })
})
