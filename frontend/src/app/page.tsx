'use client'

import { useState, useEffect } from 'react'
import { Box, Heading, Spinner, Text } from '@chakra-ui/react'
import { Select } from '@chakra-ui/react';


import DrugChart from './components/DrugChart'

type Drug = {
  name: string
  dose_mg: number
  tmax_h: number
  half_life_h: number
  cmax_ng_ml: number
}

type ChartData = {
    times: number[]
    concentrations: number[]
}

export default function HomePage() {
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [selectedDrug, setSelectedDrug] = useState<string>("")
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [loadingDrugs, setLoadingDrugs] = useState<boolean>(true)
  const [loadingChart, setLoadingChart] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (!apiUrl) {
      setError("API URL is not defined")
      setLoadingDrugs(false)
      return
    }

    fetch(`${apiUrl}/api/drugs`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        console.log('Drugs data:', data)
        setDrugs(data)
        if (data.length > 0) {
          setSelectedDrug(data[0].name)
        }
        setLoadingDrugs(false)
      })
      .catch(err => {
        console.error('Error fetching drugs:', err)
        setError("薬データの取得に失敗しました")
        setLoadingDrugs(false)
      })
  }, [apiUrl])

  useEffect(() => {
    if (selectedDrug) {
      setLoadingChart(true)
      fetch(`${apiUrl}/api/drug_curve?name=${encodeURIComponent(selectedDrug)}&duration=24&intervals=100`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
        .then(data => {
          console.log('Drug curve data:', data)
          const { times, concentrations } = data
          setChartData({
              times,
              concentrations
          })
          setLoadingChart(false)
        })
        .catch(err => {
          console.error('Error fetching drug curve:', err)
          setError("薬濃度データの取得に失敗しました")
          setLoadingChart(false)
        })
    }
  }, [selectedDrug, apiUrl])

  const handleDrugChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDrug(e.target.value)
    setChartData(null)
    setError(null)
  }

  return (
    <Box p={6}>
      <Heading as="h1" size="xl" mb={4} children="薬の半減期グラフ" />

      {loadingDrugs ? (
        <Spinner size="lg" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Select
          placeholder="薬を選択してください"
          value={selectedDrug}
          onChange={handleDrugChange}
          mb={6}
        >
          {drugs.map(drug => (
            <option key={drug.name} value={drug.name}>
              {drug.name}
            </option>
          ))}
        </Select>
      )}
      {loadingChart ? (
        <Spinner size="lg" />
      ) : chartData ? (
        <DrugChart data={chartData} />
      ) : (
        !error && <Text>薬を選択するとグラフが表示されます</Text>
      )}
    </Box>
  )
}
