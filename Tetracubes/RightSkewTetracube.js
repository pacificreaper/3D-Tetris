class RightSkewTetracube extends Tetracube{
   constructor() {
      super();
  }
   createTetracube(){
      const color = [Math.random(), Math.random(), Math.random()];

      const positions = [
         [0, 0, 0],
         [1, 0, 0],
         [1, 1, 1],
         [1, 0, 1],
      ];

      positions.forEach(position => {
         const cube = createCube(color, position);
         this.cubes.push(cube);
      });

      this.initBuffers();
   }
}