class TTetracube extends Tetracube{
   constructor() {
      super();
  }
   createTetracube(){
      const color = [Math.random(), Math.random(), Math.random()];

      const positions = [
         [0, 0, 0],
         [1, 0, 0],
         [1, 1, 0],
         [2, 0, 0],
      ];

      positions.forEach(position => {
         const cube = createCube(color, position);
         this.cubes.push(cube);
      });
      
      this.initBuffers();
   }
}