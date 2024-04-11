import SongCard from "../components/SongCard";
import {Button, Checkbox, Container, Divider, FormControlLabel, Grid, Link, Slider, TextField} from "@mui/material";
import LazyTable from "../components/LazyTable";
import config from "../config.json";
import {formatDuration} from "../helpers/formatter";
import {DataGrid} from "@mui/x-data-grid";

export default function GlassdoorJobsPage() {

  return(
      <Container>
          {selectedSongId && <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />}
          <h2>Search Songs</h2>
          <Grid container spacing={6}>
              <Grid item xs={8}>
                  <TextField label='Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }} />
              </Grid>
              <Grid item xs={4}>
                  <FormControlLabel
                      label='Explicit'
                      control={<Checkbox checked={explicit} onChange={(e) => setExplicit(e.target.checked)} />}
                  />
              </Grid>
              <Grid item xs={6}>
                  <p>Duration</p>
                  <Slider
                      value={duration}
                      min={60}
                      max={660}
                      step={10}
                      onChange={(e, newValue) => setDuration(newValue)}
                      valueLabelDisplay='auto'
                      valueLabelFormat={value => <div>{formatDuration(value)}</div>}
                  />
              </Grid>
              <Grid item xs={6}>
                  <p>Plays (millions)</p>
                  <Slider
                      value={plays}
                      min={0}
                      max={1100000000}
                      step={10000000}
                      onChange={(e, newValue) => setPlays(newValue)}
                      valueLabelDisplay='auto'
                      valueLabelFormat={value => <div>{value / 1000000}</div>}
                  />
              </Grid>
              {/* TODO (TASK 24): add sliders for danceability, energy, and valence (they should be all in the same row of the Grid) */}
              {/* Hint: consider what value xs should be to make them fit on the same row. Set max, min, and a reasonable step. Is valueLabelFormat is necessary? */}
              <Grid item xs={4}>
                  <p>Danceability</p>
                  <Slider
                      value={danceability}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={(e, newValue) => setDanceability(newValue)}
                      valueLabelDisplay='auto'
                      valueLabelFormat={value => <div>{value}</div>}
                  />
              </Grid>

              <Grid item xs={4}>
                  <p>Energy</p>
                  <Slider
                      value={energy}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={(e, newValue) => setEnergy(newValue)}
                      valueLabelDisplay='auto'
                      valueLabelFormat={value => <div>{value}</div>}
                  />
              </Grid>

              <Grid item xs={4}>
                  <p>Valence</p>
                  <Slider
                      value={valence}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={(e, newValue) => setValence(newValue)}
                      valueLabelDisplay='auto'
                      valueLabelFormat={value => <div>{value}</div>}
                  />
              </Grid>

          </Grid>
          <Button onClick={() => search()} style={{ left: '50%', transform: 'translateX(-50%)' }}>
              Search
          </Button>
          <h2>Results</h2>
          {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
          <DataGrid
              rows={data}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 25]}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              autoHeight
          />
      </Container>
  )
}