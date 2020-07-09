import { Multischemase } from './multischemase';
import { Context } from '../interfaces/context.interface';
class TestMultischemase extends Multischemase {
  public testConnection(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public getClient(): import('knex') <any, unknown[]> {
    throw new Error('Method not implemented.');
  }
  protected onMigrate(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  protected onClean(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  protected onList(): Promise<import('../interfaces/list-info.interface').ListInfo> {
    throw new Error('Method not implemented.');
  }
  protected onCurrent(): Promise<string> {
    throw new Error('Method not implemented.');
  }
  protected onDestroy(): void {
    throw new Error('Method not implemented.');
  }
  protected onContextChange(context: Context): void {
    return undefined;
  }
}

let testMultischemase: TestMultischemase;

describe('Multischemase', () => {
  beforeEach(() => {
    testMultischemase = new TestMultischemase();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('abstract methods', () => {
    it('onMigrate', async () => {
      //Arrange
      const spyOnMethod = jest.spyOn<any, string>(testMultischemase, 'onMigrate')
        .mockResolvedValue(undefined);
      const spyOnContextChange = jest.spyOn<any, string>(testMultischemase, 'onContextChange');
      //Act
      testMultischemase.setContext('test1', 'test2');
      await testMultischemase.migrate();
      //Assert
      expect(spyOnMethod).toHaveBeenCalledTimes(1); 
      expect(spyOnContextChange).toHaveBeenCalledWith({ schema: 'test1_test2' });
    });
    it('onClean', async () => {
      //Arrange
      const spyOnMethod = jest.spyOn<any, string>(testMultischemase, 'onClean')
        .mockResolvedValue(undefined);
      const spyOnContextChange = jest.spyOn<any, string>(testMultischemase, 'onContextChange');
      //Act
      testMultischemase.setContext('test1', 'test2');
      await testMultischemase.clean();
      //Assert
      expect(spyOnMethod).toHaveBeenCalledTimes(1); 
      expect(spyOnContextChange).toHaveBeenCalledWith({ schema: 'test1_test2' });
    });
    it('onCurrent', async () => {
      //Arrange
      const spyOnMethod = jest.spyOn<any, string>(testMultischemase, 'onCurrent')
        .mockResolvedValue('task.sql');
      const spyOnContextChange = jest.spyOn<any, string>(testMultischemase, 'onContextChange');
      //Act
      testMultischemase.setContext('test1', 'test2');
      const current = await testMultischemase.current();
      //Assert
      expect(spyOnMethod).toHaveBeenCalledTimes(1); 
      expect(spyOnContextChange).toHaveBeenCalledWith({ schema: 'test1_test2' });
      expect(current).toEqual('task.sql');
    });
    it('onList', async () => {
      //Arrange
      const spyOnMethod = jest.spyOn<any, string>(testMultischemase, 'onList')
        .mockResolvedValue(['task.sql', 'user.sql']);
      const spyOnContextChange = jest.spyOn<any, string>(testMultischemase, 'onContextChange');
      //Act
      testMultischemase.setContext('test1', 'test2');
      const list = await testMultischemase.list();
      //Assert
      expect(list).toEqual(['task.sql', 'user.sql']);
      expect(spyOnMethod).toHaveBeenCalledTimes(1); 
      expect(spyOnContextChange).toHaveBeenCalledWith({ schema: 'test1_test2' });
    });
    it('onDestroy', () => {
      //Arrange
      const spyOnMethod = jest.spyOn<any, string>(testMultischemase, 'onDestroy')
        .mockResolvedValue(undefined);
      //Act
      testMultischemase.destroy();
      //Assert
      expect(spyOnMethod).toHaveBeenCalledTimes(1); 
    });
  });
  describe('implemented methods', () => {
    it('checkDestroyed', () => {
      //Arrange
      const spyOnDestroy = jest.spyOn<any, string>(testMultischemase, 'onDestroy')
        .mockReturnValue(undefined);
      const spyOnMigrate = jest.spyOn<any, string>(testMultischemase, 'onMigrate')
        .mockReturnValue(undefined);
      //Act
      testMultischemase.setContext('test1', 'teste2');
      testMultischemase.destroy();
      const catchThrowable = expect(() => testMultischemase.migrate());
      //Assert
      catchThrowable.toThrow();
      expect(spyOnDestroy).toHaveBeenCalledTimes(1);
      expect(spyOnMigrate).not.toHaveBeenCalled();
    });
    it('checkLocked', () => {
      //Arrange
      jest.spyOn<any, string>(testMultischemase, 'migrate')
        .mockImplementation(() => testMultischemase['lock'] = true);
      jest.spyOn<any, string>(testMultischemase, 'onList')
        .mockReturnValue(undefined);
      //Act
      testMultischemase.setContext('test1', 'teste2');
      testMultischemase.migrate();
      const catchThrowable = expect(() => testMultischemase.list());
      //Assert
      catchThrowable.toThrow();
    });
    it('CheckContexted', () => {
      //Arrange
      const spyOnMigrate = jest.spyOn<any, string>(testMultischemase, 'onMigrate')
        .mockReturnValue(undefined);
      //Act
      const catchThrowable = expect(() => testMultischemase.migrate());
      //Assert
      catchThrowable.toThrow();
      expect(spyOnMigrate).not.toHaveBeenCalled();
    });
  });
});